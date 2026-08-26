import React from 'react';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';

interface IconProps {
  color?: string;
  size?: number;
}

/**
 * Home icon — outline house (matching reference image)
 */
export const HomeIcon = ({ color = '#ff0000', size = 26 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Roof */}
    <Path
      d="M3 10.5L12 3L21 10.5"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Left wall */}
    <Path
      d="M3 10.5V20C3 20.55 3.45 21 4 21H8.5"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right wall */}
    <Path
      d="M21 10.5V20C21 20.55 20.55 21 20 21H15.5"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Door frame + top */}
    <Path
      d="M9.5 21V16.5C9.5 15.12 10.12 14.5 11.5 14.5H12.5C13.88 14.5 14.5 15.12 14.5 16.5V21"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Door bottom line connecting left/right */}
    <Path
      d="M8.5 21H15.5"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Plus / Add icon — thick rounded plus (matching reference image)
 */
export const AddIcon = ({ color = '#ff0000', size = 26 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4V20"
      stroke={color}
      strokeWidth={3.2}
      strokeLinecap="round"
    />
    <Path
      d="M4 12H20"
      stroke={color}
      strokeWidth={3.2}
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Gift / Products icon — outline gift box (matching reference image)
 * Top loop bow + box body with center ribbon
 */
export const ProductsIcon = ({ color = '#ff0000', size = 26 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Bow left */}
    <Path
      d="M12 7C11 5.5 8.5 3.5 7 4.5C5.5 5.5 7 7.5 9 7H12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Bow right */}
    <Path
      d="M12 7C13 5.5 15.5 3.5 17 4.5C18.5 5.5 17 7.5 15 7H12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Lid */}
    <Rect
      x="2"
      y="7"
      width="20"
      height="4"
      rx="1"
      stroke={color}
      strokeWidth={2}
    />
    {/* Box body */}
    <Rect
      x="3"
      y="11"
      width="18"
      height="10"
      rx="1"
      stroke={color}
      strokeWidth={2}
    />
    {/* Center ribbon vertical line in lid */}
    <Line
      x1="12"
      y1="7"
      x2="12"
      y2="11"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    {/* Center ribbon vertical line in box body */}
    <Line
      x1="12"
      y1="11"
      x2="12"
      y2="21"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Tag / Categories icon — outline price tag (matching reference image style)
 */
export const CategoriesIcon = ({ color = '#ff0000', size = 26 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Tag body */}
    <Path
      d="M20.5 13.5L13.5 20.5C13.11 20.89 12.58 21.11 12.03 21.11C11.48 21.11 10.95 20.89 10.56 20.5L3.5 13.5C3.11 13.11 2.89 12.58 2.89 12.03V5C2.89 3.9 3.79 3 4.89 3H12C12.55 3 13.08 3.22 13.47 3.61L20.5 10.64C21.29 11.43 21.29 12.71 20.5 13.5Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Dot */}
    <Circle cx="7.5" cy="7.5" r="1.5" fill={color} />
  </Svg>
);

/**
 * Gamepad / Skins Overview Icon — wide proportion outline controller
 */
export const GamepadIcon = ({ color = '#ff4655', size = 26 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Controller Body (wide landscape shape) */}
    <Path
      d="M6 7.5H18C19.65 7.5 21 8.85 21 10.5V13.5C21 16.2 18.8 18.5 16.2 18.5C14.7 18.5 13.4 17.4 12.8 16H11.2C10.6 17.4 9.3 18.5 7.8 18.5C5.2 18.5 3 16.2 3 13.5V10.5C3 8.85 4.35 7.5 6 7.5Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* D-Pad Horizontal */}
    <Line x1="6.5" y1="12.5" x2="10.5" y2="12.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    {/* D-Pad Vertical */}
    <Line x1="8.5" y1="10.5" x2="8.5" y2="14.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    {/* Action Buttons */}
    <Circle cx="15.5" cy="13.5" r="1" fill={color} />
    <Circle cx="17.5" cy="11.5" r="1" fill={color} />
  </Svg>
);

/**
 * Cart / Orders Overview Icon — outline shopping cart
 */
export const CartIcon = ({ color = '#4fc3f7', size = 26 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="19.5" r="1.5" fill={color} />
    <Circle cx="17.5" cy="19.5" r="1.5" fill={color} />
    <Path
      d="M3 4H5.5L7.2 15H18.5L20.5 7H6.2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Alert / Low Stock Overview Icon — outline warning triangle
 */
export const AlertIcon = ({ color = '#f97316', size = 26 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4L21.5 19H2.5L12 4Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line x1="12" y1="9.5" x2="12" y2="14" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export const EditIcon = ({ color = '#ff0000', size = 26 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 4.5L19.5 8L6.5 21H3V17.5L16 4.5Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.5 7L17 10.5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const DeleteIcon = ({ color = '#ff0000', size = 26 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6H21"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 6L6.5 19.5C6.58333 20.25 7.25 21 8 21H16C16.75 21 17.4167 20.25 17.5 19.5L19 6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Search Icon — outline magnifying glass
 */
export const SearchIcon = ({ color = '#ff0000', size = 26 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 16L21 21" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * Hamburger / Menu Icon — 3 horizontal lines
 */
export const MenuIcon = ({ color = '#ffffff', size = 24 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6H20" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M4 12H20" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M4 18H20" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);

/**
 * Close / X Icon
 */
export const CloseIcon = ({ color = '#ffffff', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M6 6L18 18" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);

/**
 * Profile / User Icon
 */
export const ProfileIcon = ({ color = '#ffffff', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} />
  </Svg>
);

/**
 * User Role Icon — sleek user silhouette
 */
export const UserRoleIcon = ({ color = '#4fc3f7', size = 16 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 20V18C19 16.1 17.2 14.5 15 14.5H9C6.8 14.5 5 16.1 5 18V20" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * Admin Role Icon — sleek crown icon
 */
export const AdminRoleIcon = ({ color = '#ff4655', size = 16 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 18L4.5 8.5L9 12L12 4.5L15 12L19.5 8.5L21 18H3Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="4.5" cy="7" r="1" fill={color} />
    <Circle cx="12" cy="3.2" r="1" fill={color} />
    <Circle cx="19.5" cy="7" r="1" fill={color} />
  </Svg>
);


