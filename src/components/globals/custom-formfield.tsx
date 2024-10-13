/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import {
  DATE_DEFAULT_FORMAT,
  DATE_DISPLAY_FORMAT,
  DATE_YEAR_MIN,
  FormFieldType,
  OPT_LENGTH,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "./custom-calendar";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { DynamicSelect } from "./dynamic-select";
import { Textarea } from "../ui/textarea";
import ImageUpload from "./image-uploader";
import { DynamicArraySelect } from "./dynamic-array-select";
import { Switch } from "../ui/switch";
import RichTextEditor from "./rich-text-editor";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  options?: Array<string>;
  dynamicOptions?: { label: string; value: string }[];
  label?: string;
  type?: string | number;
  placeholder?: string;
  description?: string | React.ReactNode;
  dateFormat?: string;
  showTimeSelect?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  isRequired?: boolean;
  className?: string;
  autoFocus?: boolean;
  renderedValue?: string | string[];
  onCreate?: (value: string) => void;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const {
    fieldType,
    placeholder,
    disabled,
    description,
    type,
    options,
    dynamicOptions,
    label,
    autoFocus,
    renderedValue,
    onCreate,
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <>
          <FormControl>
            <div className="w-full rounded-tl-none rounded-bl-none bg-none relative">
              <Input
                type={
                  type === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : type
                }
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                className="bg-zinc-100"
                autoFocus={autoFocus}
                onChange={(event) => {
                  const value =
                    type === "number"
                      ? parseFloat(event.target.value)
                      : event.target.value;
                  field.onChange(value);
                }}
              />
              {type === "password" && (
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={toggleShowPassword}
                  className="absolute top-1/2 -translate-y-1/2 inset-y-0 right-0 mr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4 opacity-50" />
                  )}
                </button>
              )}
            </div>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.TEXTAREA:
      return (
        <>
          <FormControl>
            <div className="shad-input-outer">
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                className="shad-input"
                autoFocus={autoFocus}
              />
            </div>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.PHONE_INPUT:
      return (
        <>
          <FormControl>
            <PhoneInput
              placeholder={placeholder}
              defaultCountry="PH"
              countries={["PH"]}
              international
              countryCallingCodeEditable={false}
              withCountryCallingCode
              limitMaxLength={true}
              numberInputProps={{
                className: `rounded-md px-4 focus:outline focus:border !bg-zinc-100 h-full w-full border-0
                                    ${
                                      disabled
                                        ? "disabled:opacity-50 disabled:cursor-not-allowed"
                                        : ""
                                    }
                                    ${!field.value ? "text-gray-500" : ""}`,
              }}
              value={field.value as string}
              onChange={field.onChange}
              maxLength={16}
              className="ml-3 h-10"
              disabled={disabled}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </>
      );

    case FormFieldType.OTP_INPUT:
      return (
        <FormControl>
          <InputOTP
            className="w-full flex justify-between"
            maxLength={OPT_LENGTH}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            {...field}
          >
            <InputOTPSlot
              index={0}
              className="justify-center flex border border-input rounded-lg size-16 gap-4"
            />
            <InputOTPSlot
              index={1}
              className="justify-center flex border border-input rounded-lg size-16 gap-4"
            />
            <InputOTPSlot
              index={2}
              className="justify-center flex border border-input rounded-lg size-16 gap-4"
            />
            <InputOTPSlot
              index={3}
              className="justify-center flex border border-input rounded-lg size-16 gap-4"
            />
            <InputOTPSlot
              index={4}
              className="justify-center flex border border-input rounded-lg size-16 gap-4"
            />
            <InputOTPSlot
              index={5}
              className="justify-center flex border border-input rounded-lg size-16 gap-4"
            />
          </InputOTP>
        </FormControl>
      );

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            onValueChange={field.onChange}
            value={field.value || renderedValue}
          >
            <SelectTrigger
              disabled={disabled}
              className={cn(
                "bg-zinc-100",
                !field.value && "text-muted-foreground"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {dynamicOptions &&
                dynamicOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.DYNAMICSELECT:
      return (
        <FormControl>
          <DynamicSelect
            onChange={field.onChange}
            disabled={disabled}
            placeholder={placeholder}
            options={dynamicOptions}
            onCreate={(value) => onCreate && onCreate(value)}
            value={field.value || ""}
          />
        </FormControl>
      );

    case FormFieldType.DYNAMICSELECTARRAY:
      return (
        <FormControl>
          <DynamicArraySelect
            onChange={field.onChange}
            disabled={disabled}
            placeholder={placeholder}
            options={dynamicOptions}
            onCreate={(value) => onCreate && onCreate(value)}
            value={field.value || []}
          />
        </FormControl>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "shad-input ml-2",
                  !field.value && "text-muted-foreground"
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-4 h-4 w-4" />
                {field.value ? (
                  format(field.value, DATE_DISPLAY_FORMAT)
                ) : (
                  <span>Select a date</span>
                )}
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent align="start" className=" w-auto p-0">
            <Calendar
              mode="single"
              captionLayout="dropdown-buttons"
              selected={field.value ? new Date(field.value) : undefined}
              onSelect={(date) =>
                date && field.onChange(format(date, DATE_DEFAULT_FORMAT))
              }
              fromYear={DATE_YEAR_MIN}
              toYear={new Date().getFullYear()}
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>
      );

    case FormFieldType.RADIO:
      return (
        <FormControl>
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="radio-group flex items-center space-x-2"
            disabled={disabled}
          >
            {options &&
              options.map((option) => (
                <FormItem
                  key={option}
                  className="radio-item flex gap-1.5 items-center"
                >
                  <FormControl>
                    <RadioGroupItem value={option} />
                  </FormControl>
                  <FormLabel
                    className={cn(
                      "!my-auto font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {option}
                  </FormLabel>
                </FormItem>
              ))}
          </RadioGroup>
        </FormControl>
      );

    case FormFieldType.CHECKBOX:
      return (
        <div className="items-top flex space-x-2">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="grid gap-1.5 leading-none">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
        </div>
      );

    case FormFieldType.DROP_ZONE:
      return (
        <FormControl>
          <ImageUpload
            defaultValue={field.value || ""}
            onImageUpload={(url) => field.onChange(url)}
          />
        </FormControl>
      );

    case FormFieldType.RICHTEXT:
      return (
        <FormControl>
          <RichTextEditor
            description={field.value}
            onChange={field.onChange}
            disabled={disabled}
          />
        </FormControl>
      );

    case FormFieldType.SWITCH:
      return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.HIDDEN:
      return (
        <FormControl>
          <Input
            type="text"
            name="verify"
            value={field.value}
            onChange={field.onChange}
            hidden
          />
        </FormControl>
      );

    case FormFieldType.HONEY_POT:
      return (
        <FormControl>
          <Input
            type="text"
            name="xfield"
            value={""}
            // onChange={field.onChange}
            className="hidden"
          />
        </FormControl>
      );

    default:
      break;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, label, name, isRequired, className } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="space-y-1">
            {fieldType !== FormFieldType.CHECKBOX && label && (
              <FormLabel>
                {label}
                {isRequired === true ? (
                  <span className="text-red-700 text-lg"> *</span>
                ) : isRequired === false ? (
                  <span className="text-gray-500 text-xs font-normal ml-2">
                    (Optional)
                  </span>
                ) : (
                  ""
                )}
              </FormLabel>
            )}
            <RenderField field={field} props={props} />
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
