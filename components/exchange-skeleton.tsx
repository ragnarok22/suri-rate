import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ExchangeSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {[1, 2].map((item) => (
        <Card className="overflow-hidden" key={item}>
          <CardHeader className="bg-green-50 p-4">
            <div className="flex items-center gap-3 hover:text-green-700 transition-colors">
              <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-gray-300 animate-pulse" />
              <div className="flex items-center gap-1 w-20 h-7 bg-gray-300 rounded-sm animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="p-4 text-gray-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">USD</span>
                  <span className="text-xs text-gray-400">US Dollar</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Buy Rate:</span>
                    <div className="flex items-center gap-1">
                      <span className="w-12 h-6 bg-gray-300 rounded-sm animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sell Rate:</span>
                    <div className="flex items-center gap-1">
                      <span className="w-12 h-6 bg-gray-300 rounded-sm animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">EUR</span>
                  <span className="text-xs text-gray-400">Euro</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Buy Rate:</span>
                    <div className="flex items-center gap-1">
                      <span className="w-12 h-6 bg-gray-300 rounded-sm animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sell Rate:</span>
                    <div className="flex items-center gap-1">
                      <span className="w-12 h-6 bg-gray-300 rounded-sm animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
