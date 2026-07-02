import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, Monitor, Phone, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError("");
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = "Vui lòng nhập họ tên";
    else if (form.fullName.trim().length < 2) errs.fullName = "Họ tên quá ngắn";

    if (!form.email.trim()) errs.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Email không hợp lệ";

    if (!form.phone.trim()) errs.phone = "Vui lòng nhập số điện thoại";
    else if (!/^(0|\+84)[0-9]{9}$/.test(form.phone.replace(/\s/g, "")))
      errs.phone = "Số điện thoại không hợp lệ";

    if (!form.password) errs.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 6) errs.password = "Mật khẩu phải có ít nhất 6 ký tự";

    if (!form.confirmPassword) errs.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Mật khẩu xác nhận không khớp";

    return errs;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setServerError("");
    setSubmitting(true);
    const result = await register(form.fullName.trim(), form.email.trim(), form.phone.trim(), form.password);
    setSubmitting(false);

    if (result.success) navigate("/profile");
    else setServerError(result.message);
  };

  return (
    <div
      style={{ paddingTop: "140px", minHeight: "100vh", backgroundColor: "#f8fafc" }}
      className="flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
            <Monitor size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo tài khoản CAS</h1>
          <p className="mt-1 text-sm text-gray-500">Đăng ký để theo dõi đơn hàng và lưu sản phẩm yêu thích</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {serverError && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-center text-sm font-medium text-red-600">
                {serverError}
              </div>
            )}

            <Field
              label="Họ và tên"
              icon={User}
              value={form.fullName}
              error={errors.fullName}
              placeholder="Nguyễn Văn A"
              onChange={(value) => update("fullName", value)}
            />
            <Field
              label="Email"
              icon={Mail}
              type="email"
              value={form.email}
              error={errors.email}
              placeholder="email@example.com"
              onChange={(value) => update("email", value)}
            />
            <Field
              label="Số điện thoại"
              icon={Phone}
              type="tel"
              value={form.phone}
              error={errors.phone}
              placeholder="0901234567"
              onChange={(value) => update("phone", value)}
            />

            <PasswordField
              label="Mật khẩu"
              value={form.password}
              error={errors.password}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              onChange={(value) => update("password", value)}
            />
            <PasswordField
              label="Xác nhận mật khẩu"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              show={showConfirm}
              onToggle={() => setShowConfirm(!showConfirm)}
              onChange={(value) => update("confirmPassword", value)}
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  error,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  icon: typeof User;
  value: string;
  error?: string;
  placeholder: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border-2 py-3 pl-10 pr-4 text-sm transition-all focus:border-blue-600 focus:outline-none"
          style={{ borderColor: error ? "#ef4444" : "#e5e7eb" }}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function PasswordField({
  label,
  value,
  error,
  show,
  onToggle,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  show: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ít nhất 6 ký tự"
          className="w-full rounded-xl border-2 py-3 pl-10 pr-12 text-sm transition-all focus:border-blue-600 focus:outline-none"
          style={{ borderColor: error ? "#ef4444" : "#e5e7eb" }}
        />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
