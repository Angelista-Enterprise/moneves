"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

interface HelpHoverContextType {
  isHelpHovered: boolean;
  isHelpToggled: boolean;
  setHelpHovered: (hovered: boolean) => void;
  setHelpToggled: (toggled: boolean) => void;
}

const HelpHoverContext = createContext<HelpHoverContextType | undefined>(
  undefined
);

export const useHelpHover = () => {
  const context = useContext(HelpHoverContext);
  if (!context) {
    throw new Error("useHelpHover must be used within a HelpHoverProvider");
  }
  return context;
};

interface HelpHoverProviderProps {
  children: React.ReactNode;
}

export const HelpHoverProvider: React.FC<HelpHoverProviderProps> = ({
  children,
}) => {
  const [isHelpHovered, setIsHelpHovered] = useState(false);
  const [isHelpToggled, setIsHelpToggled] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setHelpHovered = useCallback(
    (hovered: boolean) => {
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (hovered) {
        // Immediate show for better UX
        setIsHelpHovered(true);
      } else {
        // Debounced hide with 200ms delay (only if not toggled)
        debounceTimeoutRef.current = setTimeout(() => {
          if (!isHelpToggled) {
            setIsHelpHovered(false);
          }
        }, 200);
      }
    },
    [isHelpToggled]
  );

  const setHelpToggled = useCallback((toggled: boolean) => {
    setIsHelpToggled(toggled);
    if (toggled) {
      // When toggling on, also show hover state
      setIsHelpHovered(true);
    } else {
      // When toggling off, hide immediately
      setIsHelpHovered(false);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <HelpHoverContext.Provider
      value={{
        isHelpHovered,
        isHelpToggled,
        setHelpHovered,
        setHelpToggled,
      }}
    >
      {children}
    </HelpHoverContext.Provider>
  );
};
