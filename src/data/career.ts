/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createCareer,
  deleteCareer,
  getAllCareers,
  updateCareer,
} from "@/actions/career";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

const CareerValidation = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  jobLocation: z.string().min(1, "Job location is required"),
  experienceNeeded: z.enum(["With Experience", "No Experience Required"]),
  yearsOfExperience: z.number().int().min(0).optional(),
  jobDescription: z.string().min(1, "Job description is required"),
  jobQualification: z.string().min(1, "Job qualification is required"),
  isActive: z.boolean().default(true),
});

export function useGetCareers() {
  return useQuery({
    queryFn: async () => getAllCareers(),
    queryKey: ["careers"],
  });
}

export function useSaveCareer(initialData?: any, onClose?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof CareerValidation>) => {
      if (initialData) {
        return updateCareer(values, initialData.id);
      } else {
        return createCareer(values);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["careers"] });
        if (onClose) onClose();
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useDeleteCareer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (careerId: string) => {
      return deleteCareer(careerId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["careers"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

