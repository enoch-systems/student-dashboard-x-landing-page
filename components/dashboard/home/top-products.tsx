import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

const students = [
  {
    name: "John Okafor",
    email: "john.okafor@gmail.com",
    image: "/profile.jfif",
  },
  {
    name: "Sarah Adeyemi",
    email: "sarah.adeyemi@yahoo.com",
    image: "/profile.jfif",
  },
  {
    name: "Michael Chenwe",
    email: "michael.chenwe@outlook.com",
    image: "/profile.jfif",
  },
  {
    name: "Aisha Bello",
    email: "aisha.bello@gmail.com",
    image: "/profile.jfif",
  },
  {
    name: "Emmanuel Nwosu",
    email: "emmanuel.nwosu@yahoo.com",
    image: "/profile.jfif",
  },
]

export function TopProducts() {
  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">New Registered</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {students.map((student, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                <img
                  src={student.image || "/placeholder.svg"}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-medium">{student.name}</p>
                <p className="text-[10px] text-muted-foreground">{student.email}</p>
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-3 text-xs cursor-pointer">
          View All
        </Button>
      </CardContent>
    </Card>
  )
}