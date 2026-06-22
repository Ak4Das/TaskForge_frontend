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
})
