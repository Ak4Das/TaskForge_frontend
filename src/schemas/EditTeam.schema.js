import * as yup from "yup"

export const editTeamSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Team name is required")
    .matches(
      /^[A-Z][a-zA-Z]*(?: [a-zA-Z]+)*$/,
      "First word must start with a capital letter and contain only letters and only one space allowed btw words no space is allowed in the beginning and end of name",
    ),
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(10, "Description is too short"),
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
