import { useCallback } from "react";
import { contactService } from "../../services/contactService";
import { useUnsaveDesign } from "./useUnsaveDesign";

export const useDesignActions = (design, navigation) => {
  const unsaveActions = useUnsaveDesign(design, navigation);

  const handleContactNow = useCallback(() => {
    contactService.contactDesigner(design, navigation);
  }, [design, navigation]);

  return {
    handleContactNow,
    ...unsaveActions,
  };
};
