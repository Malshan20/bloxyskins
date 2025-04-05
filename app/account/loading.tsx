import { Skeleton } from "@/components/ui/skeleton"

export default function AccountLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid gap-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <div className="grid gap-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <div className="grid gap-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

