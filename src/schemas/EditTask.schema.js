import * as yup from "yup"

export const taskSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Task name is required")
    .matches(
      /^[A-Z][a-zA-Z.,]*(?: [a-zA-Z.,]+)*$/,
      "First word must start with a capital letter and contain only letters, '.', ',' and only one space allowed btw words no space is allowed in the beginning and end of name",
    ),

  project: yup
    .string()
    .required("Project is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid project id"),

  team: yup
    .string()
    .required("Team is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid team id"),

  owners: yup
    .array()
    .of(
      yup
        .string()
        .required("Owner is required")
        .matches(/^[0-9a-fA-F]{24}$/, "Invalid owner id"),
    )
    .min(1, "At least one owner is required")
    .required("Owners are required"),

  tags: yup
    .array()
    .of(yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid tag id")),

  timeToComplete: yup
    .number()
    .typeError("Time to complete must be a number")
    .positive("Time to complete must be greater than 0")
    .required("Time to complete is required"),

  status: yup
    .string()
    .oneOf(["To Do", "In Progress", "Completed", "Blocked"], "Invalid status")
    .required("Status is required"),

  priority: yup
    .string()
    .oneOf(["High", "Low"], "Invalid priority")
    .required("Priority is required"),
})
