interface ServerlessRequest {
  method?: string;
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  json: (data: unknown) => void;
}

export default function handler(_req: ServerlessRequest, res: ServerlessResponse) {
  res.status(200).json({
    status: "ok",
    service: "Global-elite-1m-team Command Center",
    timestamp: new Date().toISOString()
  });
}
