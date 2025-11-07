import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ExchangeSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {[1, 2].map((item) => (
        <Card className="overflow-hidden" key={item}>
          <CardHeader className="bg-green-50 dark:bg-green-950 p-4">
            <div className="flex items-center gap-3 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200">
              <div className="relative h-12 w-12 overflow-hidden rounded-md border dark:border-gray-600 bg-gray-300 dark:bg-gray-600 animate-pulse" />
              <div className="flex items-center gap-1 w-20 h-7 bg-gray-300 dark:bg-gray-600 rounded-sm animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="p-4 text-gray-800 dark:text-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    USD
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    US Dollar
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Buy Rate:</span>
                    <div className="flex items-center gap-1">
                      <span className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-sm animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sell Rate:</span>
                    <div className="flex items-center gap-1">
                      <span className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-sm animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    EUR
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Euro
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Buy Rate:</span>
                    <div className="flex items-center gap-1">
                      <span className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-sm animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sell Rate:</span>
                    <div className="flex items-center gap-1">
                      <span className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-sm animate-pulse" />
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
