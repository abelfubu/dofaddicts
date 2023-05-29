interface Window {
  dataLayer: DataLayer;
}

interface GoogleAuth {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleAuthResponse) => void;
      }) => void;
      renderButton: (element: HTMLElement, config: any) => void;
      prompt: () => void;
    };
  };
}

interface DataLayer {
  push: (data: Record<string, unknown>) => void;
}

interface GoogleAuthResponse {
  clientId: string;
  client_id: string;
  credential: string;
}

interface AuthResponse {
  accessToken: string;
}
