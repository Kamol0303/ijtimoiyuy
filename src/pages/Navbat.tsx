import { navbatRoyxati } from "@/data/mock-data";
import { ListOrdered, Trophy } from "lucide-react";

const Navbat = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="page-header">Navbat tizimi</h1>
      <p className="page-subtitle">Turar joy uylar uchun navbat tizimi</p>
    </div>

    <div className="bg-card rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tartib</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ism</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Toifa</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ball</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ro'yxatga olingan</th>
            </tr>
          </thead>
          <tbody>
            {navbatRoyxati.map((n, i) => (
              <tr key={n.tartib} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {i === 0 && <Trophy className="h-4 w-4 text-warning" />}
                    <span className="font-medium text-foreground">{n.tartib}</span>
                  </div>
                </td>
                <td className="p-4 text-sm font-medium text-foreground">{n.ism}</td>
                <td className="p-4"><span className="status-band status-band--yashil">{n.toifa}</span></td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${n.ball}%` }} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{n.ball}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{n.sana}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Navbat;
