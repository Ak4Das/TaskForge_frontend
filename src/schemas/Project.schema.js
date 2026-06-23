import * as yup from "yup"

export const projectSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Team name is required")
    .matches(
      /^[A-Z][a-zA-Z]*(?: [a-zA-Z]+)*$/,
      "Each word must start with a capital letter and contain only letters and only one space allowed btw words no space is allowed in the beginning and end of name",
    ),
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(10, "Description is too short"),
})
