import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { vi } from 'vitest';

import {
    ButtonColor,
    ButtonSize,
    ButtonVariant,
    UiButtonComponent,
} from './button.component';

describe('UiButtonComponent', () => {
    let component: UiButtonComponent;
    let fixture: ComponentFixture<UiButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UiButtonComponent],
            providers: [provideNoopAnimations()],
        }).compileComponents();

        fixture = TestBed.createComponent(UiButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('inputs', () => {
        it('should have default label "Click me"', () => {
            expect(component.label()).toBe('Click me');
        });

        it('should have default variant "raised"', () => {
            expect(component.variant()).toBe('raised');
        });

        it('should have default color "primary"', () => {
            expect(component.color()).toBe('primary');
        });

        it('should have default size "medium"', () => {
            expect(component.size()).toBe('medium');
        });

        it('should have default isDisabled false', () => {
            expect(component.isDisabled()).toBe(false);
        });

        it('should have default isLoading false', () => {
            expect(component.isLoading()).toBe(false);
        });
    });

    describe('button variants', () => {
        const variants: ButtonVariant[] = ['basic', 'raised', 'stroked', 'flat'];

        variants.forEach((variant) => {
            it(`should render ${variant} button variant`, () => {
                fixture.componentRef.setInput('variant', variant);
                fixture.detectChanges();

                const button = fixture.nativeElement.querySelector('button');
                expect(button).toBeTruthy();
            });
        });
    });

    describe('button colors', () => {
        const colors: ButtonColor[] = ['primary', 'accent', 'warn'];

        colors.forEach((color) => {
            it(`should apply ${color} color`, () => {
                fixture.componentRef.setInput('color', color);
                fixture.detectChanges();

                const button = fixture.nativeElement.querySelector('button');
                expect(button).toBeTruthy();
            });
        });
    });

    describe('button sizes', () => {
        const sizes: ButtonSize[] = ['small', 'medium', 'large'];

        sizes.forEach((size) => {
            it(`should apply ${size} size class`, () => {
                fixture.componentRef.setInput('size', size);
                fixture.detectChanges();

                const button = fixture.nativeElement.querySelector('button');
                if (size === 'small') {
                    expect(button.classList.contains('ui-button--size-small')).toBe(true);
                } else if (size === 'large') {
                    expect(button.classList.contains('ui-button--size-large')).toBe(true);
                }
            });
        });
    });

    describe('disabled state', () => {
        it('should disable button when isDisabled is true', () => {
            fixture.componentRef.setInput('isDisabled', true);
            fixture.detectChanges();

            const button = fixture.nativeElement.querySelector('button');
            expect(button.disabled).toBe(true);
        });

        it('should disable button when isLoading is true', () => {
            component.isLoading.set(true);
            fixture.detectChanges();

            const button = fixture.nativeElement.querySelector('button');
            expect(button.disabled).toBe(true);
        });
    });

    describe('loading state', () => {
        it('should show spinner when loading', () => {
            component.isLoading.set(true);
            fixture.detectChanges();

            const spinner = fixture.nativeElement.querySelector('mat-spinner');
            expect(spinner).toBeTruthy();
        });

        it('should not show spinner when not loading', () => {
            component.isLoading.set(false);
            fixture.detectChanges();

            const spinner = fixture.nativeElement.querySelector('mat-spinner');
            expect(spinner).toBeFalsy();
        });
    });

    describe('click output', () => {
        it('should emit onClick when button is clicked', () => {
            const spy = vi.fn();
            component.onClick.subscribe(spy);

            const button = fixture.nativeElement.querySelector('button');
            button.click();

            expect(spy).toHaveBeenCalled();
        });

        it('should not emit onClick when button is disabled', () => {
            const spy = vi.fn();
            component.onClick.subscribe(spy);

            fixture.componentRef.setInput('isDisabled', true);
            fixture.detectChanges();

            const button = fixture.nativeElement.querySelector('button');
            button.click();

            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('label', () => {
        it('should display custom label', () => {
            fixture.componentRef.setInput('label', 'Submit');
            fixture.detectChanges();

            const label = fixture.nativeElement.querySelector('.ui-button__label');
            expect(label.textContent.trim()).toBe('Submit');
        });
    });
});
