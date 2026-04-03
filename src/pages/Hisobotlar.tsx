import { uylar, fuqarolar, SAMARQAND_TUMANLARI } from "@/data/mock-data";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hisobotlar = () => {
  const hududlar = SAMARQAND_TUMANLARI.map(tuman => {
    const tumanUylar = uylar.filter(u => u.tuman === tuman);
    const tumanFuqarolar = fuqarolar.filter(f => f.tuman === tuman);
    const bosh = tumanUylar.filter(u => u.status === "bosh").length;
    return { nomi: tuman, uylar: tumanUylar.length, fuqarolar: tumanFuqarolar.length, bosh };
  }).filter(h => h.uylar > 0 || h.fuqarolar > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Hisobotlar</h1>
          <p className="page-subtitle">Samarqand viloyati — tumanlar bo'yicha statistika</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" />Yuklab olish</Button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tuman</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Uylar soni</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fuqarolar</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Bo'sh uylar</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Band darajasi</th>
            </tr>
          </thead>
          <tbody>
            {hududlar.map(h => (
              <tr key={h.nomi} className="border-b last:border-b-0 hover:bg-muted/30">
                <td className="p-4 font-medium text-foreground">{h.nomi}</td>
                <td className="p-4 text-foreground">{h.uylar}</td>
                <td className="p-4 text-foreground">{h.fuqarolar}</td>
                <td className="p-4 text-foreground">{h.bosh}</td>
                <td className="p-4">
                  {h.uylar > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-success rounded-full" style={{ width: `${((h.uylar - h.bosh) / h.uylar * 100)}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground">{((h.uylar - h.bosh) / h.uylar * 100).toFixed(0)}%</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Hisobotlar;
