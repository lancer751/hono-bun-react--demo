import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useCreateExpense } from "@/services/expenses";
import { createExpenseSchema } from "@server/sharedTypes";
import { Calendar } from "@/components/ui/calendar";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function CreateExpense() {
  const createExpense = useCreateExpense();
  const form = useForm({
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      await createExpense.mutate(value);

      console.log(value);
    },
  });

  return (
    <div className="p-4">
      <h2>Create Expense</h2>
      <form
        className="max-w-xl mx-auto flex gap-4 flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "A first name is required"
                  : value.length < 3
                    ? "First name must be at least 3 characters"
                    : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return (
                  value.includes("error") && 'No "error" allowed in first name'
                );
              },
            }}
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Title:</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter the title"
                />
                <FieldInfo field={field} />
              </div>
            )}
          />
        </div>

        <div>
          <form.Field
            name="amount"
            validators={{
              onChange: createExpenseSchema.shape.amount,
            }}
            children={(field) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Amount:</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="number"
                    placeholder="Enter the title"
                  />
                  <FieldInfo field={field} />
                </div>
              );
            }}
          />
        </div>

        <div>
          <form.Field
            name="date"
            validators={{
              onChange: createExpenseSchema.shape.date,
            }}
            children={(field) => (
              <div className="self-center">
                <Calendar
                  mode="single"
                  selected={new Date(field.state.value)}
                  onSelect={(date) =>
                    field.handleChange((date ?? new Date()).toISOString())
                  }
                  className="rounded-md border"
                />
                <FieldInfo field={field}/>
              </div>
            )}
          />
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div className="flex gap-2">
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
              <Button
                className="bg-accent-foreground"
                type="reset"
                onClick={(e) => {
                  // Avoid unexpected resets of form elements (especially <select> elements)
                  e.preventDefault();
                  form.reset();
                }}
              >
                Reset
              </Button>
            </div>
          )}
        />
      </form>
    </div>
  );
}
