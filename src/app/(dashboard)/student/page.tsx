import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentDashboardPage() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-indigo-600">8</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Attendance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">92%</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>GPA</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">3.8</p>
        </CardContent>
      </Card>
    </div>
  );
}
