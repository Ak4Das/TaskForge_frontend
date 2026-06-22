import * as yup from "yup"

export const editTeamSchema = yup.object({
  name: yup
    .string()
    .strict()
    .typeError("Team name must be string.")
    .matches(/^[A-Z][a-z]*$/, "First character must be capital"),
  description: yup
    .string()
    .strict()
    .typeError("Team description must be string"),
  members: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .required("Member is required")
        .matches(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
    )
    .min(1, "At least one member is required")
    .required("Members are required"),
})
