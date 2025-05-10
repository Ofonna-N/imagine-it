## Best Practices for Forms with React Hook Form & Zod

**Schema-Driven Validation**: Define a Zod schema for each form and use `zodResolver` to connect it to React Hook Form.

**Error Handling**: Always display validation errors near the relevant input. Use `helperText` or similar props for error messages.

**Accessibility**: Ensure each input has a label, and error messages are linked via `aria-describedby`.

**Default Values**: Set default values in `useForm` to avoid uncontrolled-to-controlled warnings.

**Performance**: Use React Hook Form's `Controller` only for controlled components. For simple inputs, use `register` for better performance.

**Type Safety**: Infer form types from the Zod schema for end-to-end type safety.

**Testing**: Write tests to verify validation, error display, and form submission logic.
