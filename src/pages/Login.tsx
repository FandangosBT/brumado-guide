import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate('/intro', { replace: true, state: { from } });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Por favor, insira a palavra-passe");
      return;
    }

    try {
      const success = await login(password);

      if (success) {
        // Redirecionar para a rota original via loader de introdução
        const from = location.state?.from?.pathname || "/";
        navigate('/intro', { replace: true, state: { from } });
      } else {
        setError("Palavra-passe incorreta");
        setPassword(""); // Limpar campo em caso de erro
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col p-4">
      {/* Header Image */}
      <div className="mt-8 mb-12 animate-fade-in">
        <img
          src="/header-q7.png"
          alt="Q7 Logo"
          className="w-auto h-64 object-contain mx-auto"
        />
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Acesso Restrito
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Insira a palavra-passe para continuar
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Palavra-passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-destructive text-sm font-medium animate-fade-in">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-3 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Verificando...
                    </div>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;