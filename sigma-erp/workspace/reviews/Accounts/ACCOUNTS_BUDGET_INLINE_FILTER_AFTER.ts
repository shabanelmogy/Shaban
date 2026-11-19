import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  ViewEncapsulation,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FilterAdvancedDirective } from './filter-panel.directives';

/**
 * The list filter strip (UI block 4, *Main row and More filters*). Placed on the feature's
 * reactive form, it owns the whole look — strip surface, main and advanced grids, the
 * *More filters* pill toggle with its active-count badge, the toolbar row with the mandatory
 * Reset, light/dark theme, RTL, responsive and motion. The feature owns only its fields,
 * their order and width (`sigma-filter-field`, `--wide`, `--full`), and its search logic.
 *
 * ```html
 * <form class="job-filters" appFilterPanel [formGroup]="form" (ngSubmit)="search()"
 *       [advancedControls]="advancedNames" (resetRequested)="reset()">
 *   <div class="sigma-filter-field">…</div>
 *   <ng-template appFilterAdvanced><div class="sigma-filter-field">…</div></ng-template>
 *   <ng-container appFilterActions>…Export, Search…</ng-container>
 * </form>
 * ```
 */
@Component({
  selector: 'form[appFilterPanel]',
  standalone: true,
  imports: [NgTemplateOutlet, TranslateModule],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The projected fields belong to the feature; the strip classes must reach them.
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sigma-filter-panel',
    '[class.sigma-filter-panel--stable]': 'stableLayout()',
    '[class.sigma-filter-panel--inline-actions]': 'inlineActions() && !advanced',
    '[class.sigma-filter-panel--inline-caption]': 'inlineActions() && !advanced && !!inlineActionCaption()',
    '[style.--sigma-filter-main-columns]': 'mainColumns()',
    '[style.--sigma-filter-advanced-columns]': 'advancedColumns()',
  },
})
export class FilterPanelComponent implements AfterViewInit {
  private readonly form = inject(FormGroupDirective, { self: true });
  private readonly destroyRef = inject(DestroyRef);

  /** Columns of the main row (UI block 4: at most six). */
  readonly mainColumns = input(6);
  /** Columns of the advanced panel. */
  readonly advancedColumns = input(5);
  /** Keeps field alignment and the count-badge slot stable while editing filters. */
  readonly stableLayout = input(false);
  /** Places Reset/actions beside a simple main grid; advanced filters retain the toolbar row. */
  readonly inlineActions = input(false);
  /** Label translation key reserved above inline actions beside validated fields. */
  readonly inlineActionCaption = input('');
  /** Advanced control names counted for the badge (non-empty values). */
  readonly advancedControls = input<readonly string[]>([]);
  /** Translation key of the toggle label. */
  readonly moreFiltersLabel = input('general.moreFilters');
  /** Disables Reset and the toggle while the feature is loading. */
  readonly busy = input(false);
  /** Whether the advanced panel is open. */
  readonly advancedOpen = model(false);
  /** Reset is mandatory: the feature restores its default values and reloads page 1. */
  readonly resetRequested = output<void>();

  @ContentChild(FilterAdvancedDirective) protected advanced?: FilterAdvancedDirective;

  protected readonly activeCount = signal(0);
  protected readonly advancedId = `sigma-filter-advanced-${nextId++}`;

  ngAfterViewInit(): void {
    // Counts once after the feature has restored its state, then on every change.
    this.countActive();
    this.form.valueChanges?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.countActive());
  }

  protected toggle(): void {
    this.advancedOpen.update((open) => !open);
  }

  protected reset(): void {
    this.resetRequested.emit();
  }

  private countActive(): void {
    const value = this.form.form.getRawValue() as Record<string, unknown>;
    this.activeCount.set(this.advancedControls().filter((name) => {
      const current = value[name];
      if (current === null || current === undefined) return false;
      if (Array.isArray(current)) return current.some((item) => item !== null && item !== undefined && item !== '');
      return String(current).trim() !== '';
    }).length);
  }
}

let nextId = 0;
