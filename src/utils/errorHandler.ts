import { Alert } from "react-native";

export function handleApiError(error: any): string {
    if (error.response && error.response.data && error.response.data.status_message) {
      return error.response.data.status_message;
    } else if (error.message) {
      return error.message;
    }
    return 'Unxpected error occurred. Please try again later.';
  }
  