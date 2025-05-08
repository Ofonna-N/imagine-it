Design and implement input components that integrate seamlessly with [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/) for robust form state management and schema validation.

**Requirements:**

- Use [React Hook Form](https://react-hook-form.com/) for form state and event handling.
- Use [Zod](https://zod.dev/) for schema-based validation.
- Input components must accept `name`, `control`, and `rules` props to support form registration and validation.
- Display validation errors from Zod using React Hook Form's error state.
- Ensure accessibility (labels, aria attributes, error messages).
- Support controlled and uncontrolled usage patterns as needed.
- Provide clear documentation and usage examples.

## Best Practices for Forms with React Hook Form & Zod

1. **Schema-Driven Validation**: Define a Zod schema for each form and use `zodResolver` to connect it to React Hook Form.

   ```typescript
   import { useForm } from "react-hook-form";
   import { zodResolver } from "@hookform/resolvers/zod";
   import { z } from "zod";

   // Define schema
   const schema = z.object({
     email: z.string().email(),
     password: z.string().min(8),
   });

   // Setup form
   const {
     control,
     handleSubmit,
     formState: { errors },
   } = useForm({
     resolver: zodResolver(schema),
   });
   ```

2. **Reusable Input Components**: Create generic input components (e.g., `TextField`, `SelectField`) that accept `control` and `name` props, and use `Controller` from React Hook Form. (do only when necessary, sometimes we don't need custom components)

   ```tsx
   import { Controller } from "react-hook-form";
   import TextField from "@mui/material/TextField";

   function FormTextField({ name, control, label, ...props }) {
     return (
       <Controller
         name={name}
         control={control}
         render={({ field, fieldState }) => (
           <TextField
             {...field}
             label={label}
             error={!!fieldState.error}
             helperText={fieldState.error?.message}
             {...props}
           />
         )}
       />
     );
   }
   ```

3. **Error Handling**: Always display validation errors near the relevant input. Use `helperText` or similar props for error messages.

4. **Accessibility**: Ensure each input has a label, and error messages are linked via `aria-describedby`.

5. **Default Values**: Set default values in `useForm` to avoid uncontrolled-to-controlled warnings.

6. **Performance**: Use React Hook Form's `Controller` only for controlled components. For simple inputs, use `register` for better performance.

7. **Type Safety**: Infer form types from the Zod schema for end-to-end type safety.

   ```typescript
   type FormValues = z.infer<typeof schema>;
   ```

8. **Testing**: Write tests to verify validation, error display, and form submission logic.

## Example Usage

```tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@mui/material/Button";

const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
});

export function ExampleForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: "", email: "" },
  });

  const onSubmit = (data) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTextField name="username" control={control} label="Username" />
      <FormTextField name="email" control={control} label="Email" />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

**References:**

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
- [MUI Integration Example](https://mui.com/material-ui/guides/form-validation/)
