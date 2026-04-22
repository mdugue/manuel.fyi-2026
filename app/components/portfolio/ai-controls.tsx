'use client'

import { Tooltip } from '@base-ui/react'
import { useSyncExternalStore } from 'react'
import type { Locale } from '@/i18n/config'

export type RegenerateTooltip = {
  nextModelLabel: string
  nextModelExpiresAt: number | null
  locale: Locale
  labels: {
    nextModel: string
    cached: string
    fresh: string
  }
}

export function AiControls({
  modelId,
  position,
  cycleLabel,
  onRegenerate,
  disabled,
  tooltip,
  className,
}: {
  modelId: string
  position: string
  cycleLabel: string
  onRegenerate: () => void
  disabled: boolean
  tooltip: RegenerateTooltip
  className?: string
}) {
  return (
    <div
      className={`flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint gap-4 flex-wrap ${className}`}
    >
      <div className="flex gap-[18px] flex-wrap">
        <span>model: {modelId}</span>
        <span>{position}</span>
      </div>
      <Tooltip.Provider delay={250} closeDelay={80}>
        <Tooltip.Root>
          <Tooltip.Trigger
            type="button"
            onClick={onRegenerate}
            disabled={disabled}
            className="bg-none border border-rule text-ink-soft px-3.5 py-2 font-inherit uppercase tracking-[0.14em] cursor-pointer inline-flex items-center gap-2 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span aria-hidden="true" className="text-[13px]">
              ↻
            </span>
            {cycleLabel}
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner side="top" sideOffset={10}>
              <Tooltip.Popup className="bg-paper border border-rule shadow-[0_10px_30px_-12px_rgba(30,22,14,0.25)] px-4 py-3 max-w-[280px] font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint leading-[1.55] origin-[var(--transform-origin)] transition-[transform,opacity] duration-150 data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95">
                <RegenerateTooltipContent {...tooltip} />
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  )
}

function subscribeNow(onTick: () => void) {
  const id = setInterval(onTick, 30_000)
  return () => clearInterval(id)
}

function useNow(): number | null {
  return useSyncExternalStore(
    subscribeNow,
    () => Date.now(),
    () => null,
  )
}

function RegenerateTooltipContent({
  nextModelLabel,
  nextModelExpiresAt,
  locale,
  labels,
}: RegenerateTooltip) {
  const now = useNow()
  const cached =
    now !== null &&
    nextModelExpiresAt !== null &&
    nextModelExpiresAt > now
  return (
    <div className="flex flex-col gap-1.5">
      <div>
        <div className="text-[9.5px] text-ink-faint">{labels.nextModel}</div>
        <div className="mt-0.5 text-ink-soft tracking-[0.14em] normal-case font-medium text-[12px]">
          {nextModelLabel}
        </div>
      </div>
      <div className="mt-1 pt-2 border-t border-dashed border-rule flex flex-col gap-1">
        {cached && now !== null && nextModelExpiresAt !== null ? (
          <>
            <div className="text-accent">
              {labels.cached}{' '}
              <span className="text-ink-soft normal-case">
                {formatRelative(locale, nextModelExpiresAt - now)}
              </span>
            </div>
            <div className="text-ink-faint normal-case tracking-normal text-[11px]">
              {formatAbsolute(locale, nextModelExpiresAt)}
            </div>
          </>
        ) : (
          <div>{labels.fresh}</div>
        )}
      </div>
    </div>
  )
}

function formatRelative(locale: Locale, remainingMs: number): string {
  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
    style: 'long',
  })
  const minutes = Math.round(remainingMs / 60_000)
  if (minutes < 60) {
    return rtf.format(Math.max(1, minutes), 'minute')
  }
  const hours = Math.round(remainingMs / 3_600_000)
  if (hours < 48) {
    return rtf.format(hours, 'hour')
  }
  const days = Math.round(remainingMs / 86_400_000)
  return rtf.format(days, 'day')
}

function formatAbsolute(locale: Locale, at: number): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(at))
}
