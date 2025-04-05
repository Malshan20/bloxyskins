import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />

        <div className="space-y-6 pt-4">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="md:w-1/3">
              <Skeleton className="h-64 w-full" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>

              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}

