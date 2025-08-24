import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, User, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { insertMeasurementSchema } from "@shared/schema";
import type { Measurement } from "@shared/schema";

const measurementFormSchema = insertMeasurementSchema.extend({
  chest: z.string().optional(),
  waist: z.string().optional(),
  shoulder: z.string().optional(),
  sleeveLength: z.string().optional(),
  neck: z.string().optional(),
  bicep: z.string().optional(),
  inseam: z.string().optional(),
  outseam: z.string().optional(),
  hip: z.string().optional(),
  thigh: z.string().optional(),
  calf: z.string().optional(),
  ankle: z.string().optional(),
});

type MeasurementFormData = z.infer<typeof measurementFormSchema>;

interface MeasurementFormProps {
  onClose: () => void;
}

export function MeasurementForm({ onClose }: MeasurementFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingMeasurements } = useQuery<Measurement>({
    queryKey: ["/api/measurements"],
    enabled: !!user,
    retry: false,
  });

  const form = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementFormSchema),
    defaultValues: {
      customerId: (user as any)?.id || "",
      chest: existingMeasurements?.chest || "",
      waist: existingMeasurements?.waist || "",
      shoulder: existingMeasurements?.shoulder || "",
      sleeveLength: existingMeasurements?.sleeveLength || "",
      neck: existingMeasurements?.neck || "",
      bicep: existingMeasurements?.bicep || "",
      inseam: existingMeasurements?.inseam || "",
      outseam: existingMeasurements?.outseam || "",
      hip: existingMeasurements?.hip || "",
      thigh: existingMeasurements?.thigh || "",
      calf: existingMeasurements?.calf || "",
      ankle: existingMeasurements?.ankle || "",
      notes: existingMeasurements?.notes || "",
    },
  });

  const saveMeasurementsMutation = useMutation({
    mutationFn: async (data: MeasurementFormData) => {
      const measurementData = {
        ...data,
        chest: data.chest ? parseFloat(data.chest) : null,
        waist: data.waist ? parseFloat(data.waist) : null,
        shoulder: data.shoulder ? parseFloat(data.shoulder) : null,
        sleeveLength: data.sleeveLength ? parseFloat(data.sleeveLength) : null,
        neck: data.neck ? parseFloat(data.neck) : null,
        bicep: data.bicep ? parseFloat(data.bicep) : null,
        inseam: data.inseam ? parseFloat(data.inseam) : null,
        outseam: data.outseam ? parseFloat(data.outseam) : null,
        hip: data.hip ? parseFloat(data.hip) : null,
        thigh: data.thigh ? parseFloat(data.thigh) : null,
        calf: data.calf ? parseFloat(data.calf) : null,
        ankle: data.ankle ? parseFloat(data.ankle) : null,
      };
      return await apiRequest("POST", "/api/measurements", measurementData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Measurements saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/measurements"] });
      onClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save measurements. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MeasurementFormData) => {
    saveMeasurementsMutation.mutate(data);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}` || 'U';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark-gray">Customer Measurements</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            data-testid="button-close-measurement-form"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <CardContent className="p-6">
          {/* Customer Info */}
          <div className="bg-light-beige rounded-lg p-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-bold">
                <span data-testid="text-customer-initials">
                  {getInitials((user as any)?.firstName, (user as any)?.lastName)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-dark-gray" data-testid="text-customer-name">
                  {(user as any)?.firstName} {(user as any)?.lastName}
                </h3>
                <p className="text-sm text-gray-600" data-testid="text-customer-email">
                  {(user as any)?.email}
                </p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Upper Body Measurements */}
              <div>
                <h3 className="text-lg font-semibold text-dark-gray mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Upper Body
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="chest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chest</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="42.0"
                              className="pr-12"
                              {...field}
                              data-testid="input-chest"
                            />
                          </FormControl>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            inches
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="waist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Waist</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="36.0"
                              className="pr-12"
                              {...field}
                              data-testid="input-waist"
                            />
                          </FormControl>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            inches
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shoulder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shoulder</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="18.0"
                              className="pr-12"
                              {...field}
                              data-testid="input-shoulder"
                            />
                          </FormControl>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            inches
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sleeveLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sleeve Length</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="25.0"
                              className="pr-12"
                              {...field}
                              data-testid="input-sleeve-length"
                            />
                          </FormControl>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            inches
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="neck"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Neck</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="16.0"
                              className="pr-12"
                              {...field}
                              data-testid="input-neck"
                            />
                          </FormControl>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            inches
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bicep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bicep</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="14.0"
                              className="pr-12"
                              {...field}
                              data-testid="input-bicep"
                            />
                          </FormControl>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            inches
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Lower Body Measurements */}
              <div>
                <h3 className="text-lg font-semibold text-dark-gray mb-4 flex items-center gap-2">
                  <MoveDown className="w-5 h-5" />
                  Lower Body
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="inseam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inseam</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="32.0"
                              className="pr-12"
                              {...field}
                              data-testid="input-inseam"
                            />
                          </FormControl>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            inches
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="outseam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Outseam</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="42.0"
                              className="pr-12"
                              {...field}
                              data-testid="input-outseam"
                            />
                          </FormControl>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            inches
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hip</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="38.0"
                              className="pr-12"
                              {...field}
                              data-testid="input-hip"
                            />
                          </FormControl>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            inches
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thigh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thigh</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="24.0"
                              className="pr-12"
                              {...field}
                              data-testid="input-thigh"
                            />
                          </FormControl>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            inches
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="calf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calf</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="15.0"
                              className="pr-12"
                              {...field}
                              data-testid="input-calf"
                            />
                          </FormControl>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            inches
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ankle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ankle</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="9.0"
                              className="pr-12"
                              {...field}
                              data-testid="input-ankle"
                            />
                          </FormControl>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            inches
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any special fitting requirements or notes..."
                        className="h-24"
                        {...field}
                        value={field.value || ''}
                        data-testid="textarea-measurement-notes"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={onClose}
                  data-testid="button-cancel-measurements"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-navy text-white hover:bg-blue-800"
                  disabled={saveMeasurementsMutation.isPending}
                  data-testid="button-save-measurements"
                >
                  {saveMeasurementsMutation.isPending ? "Saving..." : "Save Measurements"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
