// src/features/events/tabs/AccessSecurityTab.tsx

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
} from "../../../store/slices/eventSlice";

import { Plus, Trash2, Info } from "lucide-react";

export default function AccessSecurityTab() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.eventForm);
  const fields = form.registrationFields;

  // --------------------------------------------------------------
  // 1. Convert UI value -> backend accessMode
  // --------------------------------------------------------------
  const setAccessMode = (value: string) => {
    const map: any = {
      open: "freeAccess",
      email: "emailAccess",
      password: "passwordAccess",
      payment: "paidAccess",
    };
    dispatch(updateField({ key: "accessMode", value: map[value] }));
  };

  // --------------------------------------------------------------
  // 2. Convert backend -> UI value
  // --------------------------------------------------------------
  const uiMode =
    form.accessMode === "emailAccess"
      ? "email"
      : form.accessMode === "passwordAccess"
      ? "password"
      : form.accessMode === "paidAccess"
      ? "payment"
      : "open";

  // --------------------------------------------------------------
  // Add new registration field
  // --------------------------------------------------------------
  const addField = () => {
    dispatch(
      addRegistrationField({
        id: Date.now().toString(),
        label: "",
        type: "text",
        required: false,
      })
    );
  };

  return (
    <div className="space-y-10">

      {/* ------------------------------------------------------- */}
      {/*  ACCESS TYPE DROPDOWN (Figma style)                     */}
      {/* ------------------------------------------------------- */}
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

        {/* UI Subdescription */}
        <p className="text-xs text-[#6B6B6B] pt-1 mb-4">
          {uiMode === "open" && "Anyone can access this event without restrictions."}
          {uiMode === "email" && "Users must provide email before entering the event."}
          {uiMode === "password" && "Users must enter the password you set below."}
          {uiMode === "payment" && "Users must complete payment before accessing."}
        </p>
      </div>

      {/* ------------------------------------------------------- */}
      {/*  PASSWORD MODE                                          */}
      {/* ------------------------------------------------------- */}
      {uiMode === "password" && (
        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Enter event password"
            onChange={(e) =>
              dispatch(
                updateField({
                  key: "accessPasswordHash",
                  value: e.target.value,
                })
              )
            }
          />
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/*  PAYMENT MODE                                            */}
      {/* ------------------------------------------------------- */}
      {uiMode === "payment" && (
        <div className="p-5 border rounded-lg bg-[#B89B5E]/5 space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#B89B5E] text-white">Payment Enabled</Badge>
            <span className="text-sm text-[#6B6B6B]">Configure payment settings</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="99.00"
                onChange={(e) =>
                  dispatch(
                    updateField({
                      key: "paymentAmount",
                      value: Number(e.target.value),
                    })
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Input
                placeholder="USD"
                onChange={(e) =>
                  dispatch(updateField({ key: "currency", value: e.target.value }))
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* REGISTRATION FIELDS – Only shown for EMAIL & PASSWORD   */}
      {/* ------------------------------------------------------- */}
      {(uiMode === "email" || uiMode === "password") && (
        <div className="space-y-6 pt-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium flex items-center gap-2">
                Registration Fields
              </h3>
              <p className="text-xs text-[#6B6B6B]">
                Customize the data you want to collect before access.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={addField}
              className="border-[#B89B5E] text-[#B89B5E] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Field
            </Button>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs flex gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800">
              These fields will be shown on the user registration screen.
            </span>
          </div>

          {/* Field List */}
          <div className="space-y-4">
            {fields.map((field) => (
              <div
                key={field.id}
                className="p-4 bg-gray-50 border rounded-lg space-y-4"
              >
                <div className="grid grid-cols-3 gap-4">
                  {/* Label */}
                  <div className="space-y-1">
                    <Label>Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) =>
                        dispatch(
                          updateRegistrationField({
                            id: field.id,
                            changes: { label: e.target.value },
                          })
                        )
                      }
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-1">
                    <Label>Type</Label>
                    <Input
                      value={field.type}
                      placeholder="text / email / number"
                      onChange={(e) =>
                        dispatch(
                          updateRegistrationField({
                            id: field.id,
                            changes: { type: e.target.value },
                          })
                        )
                      }
                    />
                  </div>

                  {/* Required */}
                  <div className="space-y-1">
                    <Label>Required</Label>
                    <div className="flex items-center h-10">
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) =>
                          dispatch(
                            updateRegistrationField({
                              id: field.id,
                              changes: { required: checked },
                            })
                          )
                        }
                      />
                      <span className="ml-2 text-xs text-[#6B6B6B]">
                        {field.required ? "Required" : "Optional"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Remove Field Button */}
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
    </div>
  );
}
