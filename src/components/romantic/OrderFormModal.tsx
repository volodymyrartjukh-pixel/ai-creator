'use client';

import { Fragment, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { orderSchema, OrderFormValues } from '@/schemas/orderSchema';
import { formatCurrency } from '@/utils/formatCurrency';
import { STRINGS } from '@/lib/strings';
import type { Product } from '@/types/product';

interface OrderFormModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderFormModal({ product, isOpen, onClose }: OrderFormModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { quantity: 1 },
  });

  const quantity = watch('quantity') || 1;
  const orderTotal = product ? product.price * Number(quantity) : 0;

  // Reset form state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      reset({ quantity: 1 });
      setServerError(null);
      setSuccess(false);
    }
  }, [isOpen, reset]);

  const onSubmit = async (values: OrderFormValues) => {
    if (!product) return;
    setServerError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          ...values,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data?.message || STRINGS.modal.errorDefault);
        return;
      }

      setSuccess(true);
      reset({ quantity: 1 });
    } catch {
      setServerError(STRINGS.modal.errorDefault);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={handleClose}
        initialFocus={closeButtonRef}
        aria-labelledby="order-modal-title"
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-rose-950/40 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-rose-100 my-4">
              {/* Header */}
              <div className="rounded-t-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-5">
                <Dialog.Title
                  id="order-modal-title"
                  className="text-xl font-bold text-white font-serif"
                >
                  {STRINGS.modal.title}
                </Dialog.Title>
                {product && (
                  <p className="mt-1 text-rose-100 text-sm">
                    {product.name} &mdash; {formatCurrency(product.price)}
                  </p>
                )}
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                {success ? (
                  <div
                    role="status"
                    className="flex flex-col items-center gap-3 py-8 text-center"
                  >
                    <span className="text-5xl" aria-hidden="true">
                      💌
                    </span>
                    <h2 className="text-xl font-bold text-rose-600">
                      {STRINGS.modal.successTitle}
                    </h2>
                    <p className="text-gray-600">{STRINGS.modal.successMessage}</p>
                    <button
                      ref={closeButtonRef}
                      onClick={handleClose}
                      className="mt-4 rounded-full bg-rose-500 px-6 py-2 text-sm font-semibold text-white hover:bg-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 transition"
                    >
                      {STRINGS.modal.close}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    {serverError && (
                      <div
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                      >
                        <strong>{STRINGS.modal.errorTitle}:</strong> {serverError}
                      </div>
                    )}

                    {/* Order Total (read-only) */}
                    <div className="rounded-lg bg-rose-50 px-4 py-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-rose-700">
                        {STRINGS.modal.orderTotal}
                      </span>
                      <span
                        aria-live="polite"
                        aria-atomic="true"
                        className="text-lg font-bold text-rose-600"
                      >
                        {formatCurrency(orderTotal)}
                      </span>
                    </div>

                    {/* Full Name */}
                    <Field
                      label={STRINGS.modal.fullName}
                      htmlFor="fullName"
                      error={errors.fullName?.message}
                      required
                    >
                      <input
                        id="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder={STRINGS.modal.fullNamePlaceholder}
                        maxLength={100}
                        aria-required="true"
                        aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                        {...register('fullName')}
                        className={inputCls(!!errors.fullName)}
                      />
                    </Field>

                    {/* Email */}
                    <Field
                      label={STRINGS.modal.email}
                      htmlFor="email"
                      error={errors.email?.message}
                      required
                    >
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder={STRINGS.modal.emailPlaceholder}
                        aria-required="true"
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        {...register('email')}
                        className={inputCls(!!errors.email)}
                      />
                    </Field>

                    {/* Phone */}
                    <Field
                      label={
                        <>
                          {STRINGS.modal.phone}{' '}
                          <span className="text-gray-400 font-normal text-xs">
                            {STRINGS.modal.phoneOptional}
                          </span>
                        </>
                      }
                      htmlFor="phone"
                      error={errors.phone?.message}
                    >
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder={STRINGS.modal.phonePlaceholder}
                        maxLength={20}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        {...register('phone')}
                        className={inputCls(!!errors.phone)}
                      />
                    </Field>

                    {/* Quantity */}
                    <Field
                      label={STRINGS.modal.quantity}
                      htmlFor="quantity"
                      error={errors.quantity?.message}
                      required
                    >
                      <input
                        id="quantity"
                        type="number"
                        min={1}
                        max={99}
                        aria-required="true"
                        aria-describedby={errors.quantity ? 'quantity-error' : undefined}
                        {...register('quantity', { valueAsNumber: true })}
                        className={inputCls(!!errors.quantity)}
                      />
                    </Field>

                    {/* Delivery Address */}
                    <Field
                      label={STRINGS.modal.deliveryAddress}
                      htmlFor="deliveryAddress"
                      error={errors.deliveryAddress?.message}
                      required
                    >
                      <textarea
                        id="deliveryAddress"
                        rows={3}
                        maxLength={300}
                        placeholder={STRINGS.modal.deliveryAddressPlaceholder}
                        aria-required="true"
                        aria-describedby={errors.deliveryAddress ? 'deliveryAddress-error' : undefined}
                        {...register('deliveryAddress')}
                        className={inputCls(!!errors.deliveryAddress)}
                      />
                    </Field>

                    {/* Notes */}
                    <Field
                      label={
                        <>
                          {STRINGS.modal.notes}{' '}
                          <span className="text-gray-400 font-normal text-xs">
                            {STRINGS.modal.notesOptional}
                          </span>
                        </>
                      }
                      htmlFor="notes"
                      error={errors.notes?.message}
                    >
                      <textarea
                        id="notes"
                        rows={3}
                        maxLength={500}
                        placeholder={STRINGS.modal.notesPlaceholder}
                        aria-describedby={errors.notes ? 'notes-error' : undefined}
                        {...register('notes')}
                        className={inputCls(!!errors.notes)}
                      />
                    </Field>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={handleClose}
                        className="rounded-full border border-rose-200 px-5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 transition"
                      >
                        {STRINGS.modal.close}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        aria-disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 transition"
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner />
                            {STRINGS.modal.submitting}
                          </>
                        ) : (
                          STRINGS.modal.submit
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return [
    'w-full rounded-lg border px-3 py-2 text-sm text-gray-800 shadow-sm outline-none transition',
    'focus:ring-2 focus:ring-rose-400 focus:border-transparent',
    hasError
      ? 'border-red-400 bg-red-50 focus:ring-red-400'
      : 'border-rose-200 bg-white hover:border-rose-300',
  ].join(' ');
}

interface FieldProps {
  label: React.ReactNode;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, htmlFor, error, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-0.5 text-rose-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
