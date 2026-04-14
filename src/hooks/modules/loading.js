import { useToggle } from "@vueuse/core";

export function useLoading() {
  const [loading, toggleLoading] = useToggle();

  const startLoading = () => toggleLoading(true);
  const endLoading = () => toggleLoading(false);

  return {
    loading,
    startLoading,
    endLoading,
    toggleLoading,
    stopLoading: endLoading,
  };
}
