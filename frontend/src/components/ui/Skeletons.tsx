import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-28" />
      </CardFooter>
    </Card>
  );
}

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === 0 ? "w-1/3" : "flex-1"}`} 
        />
      ))}
    </div>
  );
}

export function SkeletonCalendar() {
  return (
    <div className="grid grid-cols-7 gap-px bg-muted border rounded-lg overflow-hidden">
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="bg-card min-h-24 p-2 flex flex-col space-y-2">
          <Skeleton className="h-4 w-6 self-end" />
          {i % 3 === 0 && <Skeleton className="h-3 w-full rounded-sm" />}
          {i % 7 === 2 && <Skeleton className="h-3 w-2/3 rounded-sm bg-primary/20" />}
        </div>
      ))}
    </div>
  );
}
