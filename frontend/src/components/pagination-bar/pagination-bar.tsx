import { useEffect, useRef, useState } from 'react';
import './pagination-bar.css';

export interface PaginationBarProps {
    totalPages: number;
    currentPage?: number;
    defaultPage?: number;
    onPageChange?: (page: number) => void;
    scrollOnChange?: boolean;
    className?: string;
}

type PaginationItem = number | 'left-ellipsis' | 'right-ellipsis';

const MIN_VISIBLE_SLOTS = 5;
const MAX_VISIBLE_SLOTS = 13;

function getWindowWidth(): number {
    return typeof window !== 'undefined' ? window.innerWidth : 1024;
}

function clampPage(page: number, totalPages: number): number {
    return Math.min(Math.max(1, Math.floor(page)), totalPages);
}

function calculateMaxSlots(availableWidth: number, totalPages: number): number {
    const digits = String(totalPages).length;
    const isCompactViewport = availableWidth < 576;
    const baseSlotWidth = isCompactViewport ? 38 : 46;
    const extraDigitWidth = Math.max(0, digits - 2) * 10;
    const slotWidth = baseSlotWidth + extraDigitWidth;
    const borderReserve = 8;

    const fittingSlots = Math.floor(Math.max(0, availableWidth - borderReserve) / slotWidth);
    return Math.min(MAX_VISIBLE_SLOTS, Math.max(MIN_VISIBLE_SLOTS, fittingSlots));
}

function buildRange(start: number, end: number): number[] {
    const result: number[] = [];
    for (let page = start; page <= end; page += 1) {
        result.push(page);
    }
    return result;
}

function getPaginationItems(totalPages: number, activePage: number, maxSlots: number): PaginationItem[] {
    if (totalPages <= maxSlots) {
        return buildRange(1, totalPages);
    }

    const sideCount = maxSlots - 2;
    const middleCount = maxSlots - 4;
    const leftSiblings = Math.floor((middleCount - 1) / 2);
    const rightSiblings = Math.ceil((middleCount - 1) / 2);

    const leftSiblingIndex = activePage - leftSiblings;
    const rightSiblingIndex = activePage + rightSiblings;

    const needsLeftEllipsis = leftSiblingIndex > 3;
    const needsRightEllipsis = rightSiblingIndex < totalPages - 2;

    if (!needsLeftEllipsis && needsRightEllipsis) {
        return [...buildRange(1, sideCount), 'right-ellipsis', totalPages];
    }

    if (needsLeftEllipsis && !needsRightEllipsis) {
        return [1, 'left-ellipsis', ...buildRange(totalPages - sideCount + 1, totalPages)];
    }

    return [
        1,
        'left-ellipsis',
        ...buildRange(leftSiblingIndex, rightSiblingIndex),
        'right-ellipsis',
        totalPages,
    ];
}

function scrollNearestContainerToTop(element: HTMLElement | null) {
    let current = element?.parentElement ?? null;
    while (current && current !== document.body && current !== document.documentElement) {
        const style = window.getComputedStyle(current);
        const isScrollableY =
            (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
            current.scrollHeight > current.clientHeight;
        if (isScrollableY && typeof current.scrollTo === 'function') {
            current.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        current = current.parentElement;
    }

    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

export default function PaginationBar({
    totalPages,
    currentPage,
    defaultPage = 1,
    onPageChange,
    scrollOnChange = true,
    className,
}: PaginationBarProps) {
    const normalizedTotalPages = Number.isFinite(totalPages) ? Math.floor(totalPages) : 0;
    const [internalPage, setInternalPage] = useState<number>(() =>
        normalizedTotalPages > 0 ? clampPage(defaultPage, normalizedTotalPages) : 1
    );
    const [availableWidth, setAvailableWidth] = useState<number>(getWindowWidth);
    const containerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const element = containerRef.current;

        const updateWidth = () => {
            const measured = element?.getBoundingClientRect().width ?? 0;
            setAvailableWidth(measured > 0 ? measured : getWindowWidth());
        };

        let resizeObserver: ResizeObserver | undefined;
        if (typeof ResizeObserver !== 'undefined' && element) {
            resizeObserver = new ResizeObserver((entries) => {
                const width = entries[0]?.contentRect.width ?? 0;
                setAvailableWidth(width > 0 ? width : getWindowWidth());
            });
            resizeObserver.observe(element);
        }

        window.addEventListener('resize', updateWidth);

        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener('resize', updateWidth);
        };
    }, [normalizedTotalPages]);

    if (normalizedTotalPages < 1) {
        return null;
    }

    const activePage = clampPage(currentPage ?? internalPage, normalizedTotalPages);
    const maxSlots = calculateMaxSlots(availableWidth, normalizedTotalPages);
    const items = getPaginationItems(normalizedTotalPages, activePage, maxSlots);

    const handleSelectPage = (page: number) => {
        if (page === activePage) {
            return;
        }
        if (currentPage === undefined) {
            setInternalPage(page);
        }
        if (scrollOnChange) {
            scrollNearestContainerToTop(containerRef.current);
        }
        onPageChange?.(page);
    };

    return (
        <nav
            ref={containerRef}
            aria-label="Paginación"
            className={`ot-pagination-bar-wrap${className ? ` ${className}` : ''}`}
        >
            <ul className="ot-pagination-bar">
                {items.map((item) => {
                    if (item === 'left-ellipsis' || item === 'right-ellipsis') {
                        return (
                            <li key={item} className="ot-pagination-bar__item" aria-hidden="true">
                                <span className="ot-pagination-bar__ellipsis">...</span>
                            </li>
                        );
                    }

                    const isActive = item === activePage;

                    return (
                        <li key={item} className="ot-pagination-bar__item">
                            <button
                                type="button"
                                className={`ot-pagination-bar__btn${isActive ? ' ot-pagination-bar__btn--active' : ''}`}
                                aria-label={`Página ${item}`}
                                aria-current={isActive ? 'page' : undefined}
                                onClick={() => handleSelectPage(item)}
                            >
                                {item}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
