import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  DEFAULT_THEME_CONFIG,
  THEME_CONFIG,
} from '../tokens/theme.tokens';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
    let service: ThemeService;
    let mockDocument: Document;
    let mockLocalStorage: { [key: string]: string };
    let mockMediaQueryList: MediaQueryList;
    let mediaQueryCallback: ((e: MediaQueryListEvent) => void) | null = null;

    beforeEach(() => {
        mockLocalStorage = {};
        mockMediaQueryList = {
            matches: false,
            media: '(prefers-color-scheme: dark)',
            addEventListener: vi.fn((event: string, callback: EventListenerOrEventListenerObject) => {
                if (event === 'change' && typeof callback === 'function') {
                    mediaQueryCallback = callback as (e: MediaQueryListEvent) => void;
                }
            }),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
        } as MediaQueryList;

        mockDocument = {
            documentElement: {
                classList: {
                    add: vi.fn(),
                    remove: vi.fn(),
                    contains: vi.fn(),
                },
            },
            defaultView: {
                matchMedia: vi.fn().mockReturnValue(mockMediaQueryList),
                localStorage: {
                    getItem: vi.fn((key: string) => mockLocalStorage[key] ?? null),
                    setItem: vi.fn((key: string, value: string) => {
                        mockLocalStorage[key] = value;
                    }),
                },
            },
        } as unknown as Document;

        TestBed.configureTestingModule({
            providers: [
                ThemeService,
                { provide: DOCUMENT, useValue: mockDocument },
                { provide: THEME_CONFIG, useValue: DEFAULT_THEME_CONFIG },
            ],
        });

        service = TestBed.inject(ThemeService);
        TestBed.flushEffects();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should default to system mode', () => {
        expect(service.themeMode()).toBe('system');
    });

    it('should resolve isDarkMode based on system preference when in system mode', () => {
        // System prefers light (mock matches: false)
        expect(service.isDarkMode()).toBe(false);
        expect(service.isLightMode()).toBe(true);
    });

    it('should set theme to dark mode', () => {
        service.setTheme('dark');
        TestBed.flushEffects();

        expect(service.themeMode()).toBe('dark');
        expect(service.isDarkMode()).toBe(true);
        expect(service.isLightMode()).toBe(false);
    });

    it('should set theme to light mode', () => {
        service.setTheme('light');
        TestBed.flushEffects();

        expect(service.themeMode()).toBe('light');
        expect(service.isDarkMode()).toBe(false);
        expect(service.isLightMode()).toBe(true);
    });

    it('should toggle theme from light to dark', () => {
        service.setTheme('light');
        TestBed.flushEffects();
        service.toggleTheme();
        TestBed.flushEffects();

        expect(service.themeMode()).toBe('dark');
        expect(service.isDarkMode()).toBe(true);
    });

    it('should toggle theme from dark to light', () => {
        service.setTheme('dark');
        TestBed.flushEffects();
        service.toggleTheme();
        TestBed.flushEffects();

        expect(service.themeMode()).toBe('light');
        expect(service.isDarkMode()).toBe(false);
    });

    it('should reset to system mode', () => {
        service.setTheme('dark');
        TestBed.flushEffects();
        service.resetToSystem();
        TestBed.flushEffects();

        expect(service.themeMode()).toBe('system');
    });

    it('should persist theme to localStorage', () => {
        service.setTheme('dark');
        TestBed.flushEffects();

        expect(mockDocument.defaultView?.localStorage.setItem).toHaveBeenCalledWith(
            'sigmax-theme-mode',
            'dark'
        );
    });

    it('should apply dark-theme class when dark mode is active', () => {
        service.setTheme('dark');
        TestBed.flushEffects();

        expect(mockDocument.documentElement.classList.add).toHaveBeenCalledWith('dark-theme');
        expect(mockDocument.documentElement.classList.remove).toHaveBeenCalledWith('light-theme');
    });

    it('should apply light-theme class when light mode is active', () => {
        service.setTheme('light');
        TestBed.flushEffects();

        expect(mockDocument.documentElement.classList.add).toHaveBeenCalledWith('light-theme');
        expect(mockDocument.documentElement.classList.remove).toHaveBeenCalledWith('dark-theme');
    });
});
