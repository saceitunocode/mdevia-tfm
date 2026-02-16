import { Shield } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero/Header Section */}
      <section className="py-16 bg-muted/20 border-b border-border/50">
        <div className="container px-4 mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl font-heading font-bold tracking-tight">Aviso Legal</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Información legal y condiciones de uso de FR Inmobiliaria.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto space-y-12 text-zinc-800 dark:text-zinc-200">
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary uppercase tracking-wider">LEY DE LOS SERVICIOS DE LA SOCIEDAD DE LA INFORMACIÓN (LSSI)</h2>
              <div className="prose prose-zinc dark:prose-invert max-w-none space-y-4 leading-relaxed">
                <p>
                  FR Inmobiliarias responsable del sitio web, en adelante RESPONSABLE, pone a disposición de los usuarios el presente documento, con el que pretende dar cumplimiento a las obligaciones dispuestas en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSICE), BOE Nº 166, así como informar a todos los usuarios del sitio web respecto a cuáles son las condiciones de uso.
                </p>
                <p>
                  Toda persona que acceda a este sitio web asume el papel de usuario, comprometiéndose a la observancia y cumplimiento riguroso de las disposiciones aquí dispuestas, así como a cualquier otra disposición legal que fuera de aplicación.
                </p>
                <p>
                  FR Inmobiliarias. se reserva el derecho de modificar cualquier tipo de información que pudiera aparecer en el sitio web, sin que exista obligación de preavisar o poner en conocimiento de los usuarios dichas obligaciones, entendiéndose como suficiente la publicación en el sitio web de FR Inmobiliarias.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold font-heading">1. DATOS IDENTIFICATIVOS</h3>
              <ul className="space-y-2 list-none border-l-2 border-primary/20 pl-6 py-2">
                <li><span className="font-bold">Nombre de dominio:</span> www.frinmobiliarias.es</li>
                <li><span className="font-bold">Nombre comercial:</span> FR Inmobiliarias</li>
                <li><span className="font-bold">Denominación social:</span> FR Inmobiliarias.</li>
                <li><span className="font-bold">Domicilio social:</span> C/ Emperador Trajano, 1 23740 ANDÚJAR (JAÉN)</li>
                <li><span className="font-bold">Teléfono:</span> 633094135</li>
                <li><span className="font-bold">E-mail:</span> frinmobiliarias2@hotmail.es</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-heading">2. DERECHOS DE PROPIEDAD INTELECTUAL E INDUSTRIAL</h3>
              <div className="space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  El sitio web, incluyendo a título enunciativo pero no limitativo su programación, edición, compilación y demás elementos necesarios para su funcionamiento, los diseños, logotipos, texto y/o gráficos, son propiedad del RESPONSABLE o, si es el caso, dispone de licencia o autorización expresa por parte de los autores. Todos los contenidos del sitio web se encuentran debidamente protegidos por la normativa de propiedad intelectual e industrial, así como inscritos en los registros públicos correspondientes.
                </p>
                <p>
                  Independientemente de la finalidad para la que fueran destinados, la reproducción total o parcial, uso, explotación, distribución y comercialización, requiere en todo caso la autorización escrita previa por parte del RESPONSABLE. Cualquier uso no autorizado previamente se considera un incumplimiento grave de los derechos de propiedad intelectual o industrial del autor.
                </p>
                <p>
                  Los diseños, logotipos, texto y/o gráficos ajenos al RESPONSABLE y que pudieran aparecer en el sitio web, pertenecen a sus respectivos propietarios, siendo ellos mismos responsables de cualquier posible controversia que pudiera suscitarse respecto a los mismos. El RESPONSABLE autoriza expresamente a que terceros puedan redirigir directamente a los contenidos concretos del sitio web, y en todo caso redirigir al sitio web principal de www.frinmobiliarias.es.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold font-heading">3. EXENCIÓN DE RESPONSABILIDADES</h3>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  El RESPONSABLE se exime de cualquier tipo de responsabilidad derivada de la información publicada en su sitio web siempre que no tenga conocimiento efectivo de que esta información haya sido manipulada o introducida por un tercero ajeno al mismo o, si lo tiene, haya actuado con diligencia para retirar los datos o hacer imposible el acceso a ellos.
                </p>
                
                <div className="space-y-4">
                  <h4 className="text-zinc-900 dark:text-zinc-100 font-bold">Uso de Cookies</h4>
                  <p className="text-sm">
                    Este sitio web puede utilizar cookies técnicas para llevar a cabo determinadas funciones que son consideradas imprescindibles para el correcto funcionamiento y visualización del sitio. Las cookies utilizadas tienen, en todo caso, carácter temporal, con la única finalidad de hacer más eficaz la navegación, y desaparecen al terminar la sesión del usuario.
                  </p>
                  <p className="text-sm">
                    El usuario tiene la posibilidad de configurar su navegador para ser alertado de la recepción de cookies y para impedir su instalación en su equipo. Por favor, consulte las instrucciones de su navegador para ampliar esta información.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-zinc-900 dark:text-zinc-100 font-bold">Política de enlaces</h4>
                  <p>
                    Desde el sitio web, es posible que se redirija a contenidos de terceros sitios web. Dado que el RESPONSABLE no puede controlar siempre los contenidos introducidos por terceros en sus respectivos sitios web, no asume ningún tipo de responsabilidad respecto a dichos contenidos. En todo caso, procederá a la retirada inmediata de cualquier contenido que pudiera contravenir la legislación nacional o internacional.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-zinc-900 dark:text-zinc-100 font-bold">Direcciones IP</h4>
                  <p>
                    Los servidores del sitio web podrán detectar de manera automática la dirección IP y el nombre de dominio utilizados por el usuario. Toda esta información es registrada en un fichero de actividad del servidor que permite el posterior procesamiento de los datos con el fin de obtener mediciones únicamente estadísticas.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-border">
              <h3 className="text-2xl font-bold font-heading">4. LEY APLICABLE Y JURISDICCIÓN</h3>
              <p className="text-muted-foreground leading-relaxed">
                Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o de las actividades en él desarrolladas, será de aplicación la legislación española, a la que se someten expresamente las partes, siendo competentes para la resolución de todos los conflictos derivados o relacionados con su uso los Juzgados y Tribunales del domicilio del USUARIO o el lugar del cumplimiento de la obligación.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
