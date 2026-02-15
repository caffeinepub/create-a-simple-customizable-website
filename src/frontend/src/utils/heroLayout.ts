import type { Position, Alignment } from '../backend';
import { Variant_top_middle_bottom } from '../backend';

export function getAlignmentClass(alignment: Alignment | string): string {
  switch (alignment) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    case 'left':
    default:
      return 'text-left';
  }
}

export function getVerticalAlignmentClass(vertical: Variant_top_middle_bottom | string): string {
  switch (vertical) {
    case Variant_top_middle_bottom.middle:
    case 'middle':
      return 'items-center';
    case Variant_top_middle_bottom.bottom:
    case 'bottom':
      return 'items-end';
    case Variant_top_middle_bottom.top:
    case 'top':
    default:
      return 'items-start';
  }
}

export function getObjectPositionClass(position?: Position): string {
  if (!position) return 'object-center';
  
  const horizontal = position.horizontal;
  const vertical = position.vertical;
  
  // Map to Tailwind object-position classes
  if (horizontal === 'center' && vertical === Variant_top_middle_bottom.middle) {
    return 'object-center';
  }
  
  if (horizontal === 'left' && vertical === Variant_top_middle_bottom.top) {
    return 'object-left-top';
  }
  
  if (horizontal === 'left' && vertical === Variant_top_middle_bottom.middle) {
    return 'object-left';
  }
  
  if (horizontal === 'left' && vertical === Variant_top_middle_bottom.bottom) {
    return 'object-left-bottom';
  }
  
  if (horizontal === 'right' && vertical === Variant_top_middle_bottom.top) {
    return 'object-right-top';
  }
  
  if (horizontal === 'right' && vertical === Variant_top_middle_bottom.middle) {
    return 'object-right';
  }
  
  if (horizontal === 'right' && vertical === Variant_top_middle_bottom.bottom) {
    return 'object-right-bottom';
  }
  
  if (horizontal === 'center' && vertical === Variant_top_middle_bottom.top) {
    return 'object-top';
  }
  
  if (horizontal === 'center' && vertical === Variant_top_middle_bottom.bottom) {
    return 'object-bottom';
  }
  
  return 'object-center';
}

export function alignmentToString(alignment: Alignment): string {
  return alignment.toString();
}

export function verticalToString(vertical: Variant_top_middle_bottom): string {
  return vertical.toString();
}
