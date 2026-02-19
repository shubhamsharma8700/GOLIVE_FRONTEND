// src/features/events/tabs/AccessSecurityTab.tsx

import { data as currencies } from "currency-codes";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";

import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Switch } from "../../../components/ui/switch";
import { Button } from "../../../components/ui/button";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

import {
  updateField,
  addRegistrationField,
  updateRegistrationField,
  removeRegistrationField,
} from "../../../store/slices/eventFormSlice";

import { Plus, Trash2, Info } from "lucide-react";

export default function AccessSecurityTab() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.eventForm);
  const fields = form.registrationFields;

  const setAccessMode = (value: string) => {
    const map: Record<string, typeof form.accessMode> = {
      open: "freeAccess",
      email: "emailAccess",
      password: "passwordAccess",
      payment: "paidAccess",
    };
    dispatch(updateField({ key: "accessMode", value: map[value] }));
    if (value === "password") {
      dispatch(updateField({ key: "accessPassword", value: "" }));
    }
  };

  const uiMode =
    form.accessMode === "emailAccess"
      ? "email"
      : form.accessMode === "passwordAccess"
        ? "password"
        : form.accessMode === "paidAccess"
          ? "payment"
          : "open";

  const handleAddField = () => {
    dispatch(
      addRegistrationField({
        id: Date.now().toString(),
        label: "",
        type: "text",
        required: false,
      })
    );
  };

  const showRegistration = uiMode === "email" || uiMode === "password" || uiMode === "payment";
  const showPassword = uiMode === "password" || uiMode === "payment";
  const showPayment = uiMode === "payment";

  return (
    <div className="space-y-10">
      {/* ACCESS TYPE */}
      <div className="space-y-2">
        <Label className="font-medium">Access Type</Label>
        <Select value={uiMode} onValueChange={setAccessMode}>
          <SelectTrigger>
            <SelectValue placeholder="Select access type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open Access</SelectItem>
            <SelectItem value="email">Email Required</SelectItem>
            <SelectItem value="password">Password Protected</SelectItem>
            <SelectItem value="payment">Payment Required</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-[#6B6B6B] pt-1">
          {uiMode === "open" && "Anyone can access this event without restrictions."}
          {uiMode === "email" && "Users must provide email before entering the event."}
          {uiMode === "password" && "Users must complete registration, then enter the password you set below."}
          {uiMode === "payment" && "Users must complete registration, then password, then payment."}
        </p>
      </div>

      {/* 1. REGISTRATION FIELDS (first for email, password, payment) */}
      {showRegistration && (
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Registration Fields</h3>
              <p className="text-xs text-[#6B6B6B]">
                Shown first. Customize the data you want to collect before access.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleAddField}
              className="border-[#B89B5E] text-[#B89B5E] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Field
            </Button>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs flex gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-blue-800">
              These fields will be shown on the user registration screen first.
            </span>
          </div>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="p-4 bg-gray-50 border rounded-lg space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label>Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) =>
                        dispatch(updateRegistrationField({ id: field.id, changes: { label: e.target.value } }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Type</Label>
                    <Select
                      value={field.type || "text"}
                      onValueChange={(v) =>
                        dispatch(updateRegistrationField({ id: field.id, changes: { type: v } }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="tel">Phone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Required</Label>
                    <div className="flex items-center h-10">
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) =>
                          dispatch(updateRegistrationField({ id: field.id, changes: { required: checked } }))
                        }
                      />
                      <span className="ml-2 text-xs text-[#6B6B6B]">{field.required ? "Required" : "Optional"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => dispatch(removeRegistrationField(field.id))}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-md text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PASSWORD (after registration; required for password & payment) */}
      {showPassword && (
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <Label>Event Password (required)</Label>
          <Input
            type="password"
            placeholder="Enter event password"
            value={form.accessPassword ?? ""}
            onChange={(e) =>
              dispatch(updateField({ key: "accessPassword", value: e.target.value }))
            }
          />
          <p className="text-xs text-[#6B6B6B]">
            {uiMode === "payment"
              ? "Users will enter this after registration, before payment."
              : "Users must enter this after registration to access the event."}
          </p>
        </div>
      )}

      {/* 3. PAYMENT AMOUNT & CURRENCY (payment only) */}
      {showPayment && (
        <div className="p-5 border rounded-lg bg-[#B89B5E]/5 space-y-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#B89B5E] text-white">Payment</Badge>
            <span className="text-sm text-[#6B6B6B]">Amount and currency (required)</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                placeholder="99.00"
                value={form.paymentAmount ?? ""}
                onChange={(e) =>
                  dispatch(
                    updateField({
                      key: "paymentAmount",
                      value:
                        e.target.value === "" || Number(e.target.value) <= 0
                          ? null
                          : Number(e.target.value),
                    })
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Currency *</Label>
              <Select
                value={form.currency ?? ""}
                onValueChange={(v) => dispatch(updateField({ key: "currency", value: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code} – {c.currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
