import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="relative grid min-h-[60dvh] place-items-center py-24 text-center">
      <div>
        <p className="display text-[clamp(6rem,24vw,14rem)] text-transparent [-webkit-text-stroke:2px_var(--color-elite-500)]">
          404
        </p>
        <h1 className="display -mt-4 text-4xl text-white sm:text-5xl">Esta herramienta no está en el taller</h1>
        <p className="mx-auto mt-4 max-w-md text-carbon-300">
          La página que buscas no existe o fue movida. Vuelve al inicio o explora el catálogo.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/">Ir al inicio</Button>
          <Button href="/tienda" variant="outline">
            Ver catálogo
          </Button>
        </div>
      </div>
    </Container>
  );
}
