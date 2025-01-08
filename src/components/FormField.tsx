interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormField({ label, ...props }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      />
    </div>
  );
}