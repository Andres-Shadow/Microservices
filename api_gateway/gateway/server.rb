require 'webrick'

def iniciar_servidor
  # Crear una instancia del servidor WEBrick y configurarla
  servidor = WEBrick::HTTPServer.new(
    Port: 9095,               # Establece el puerto 9095
    DocumentRoot: '.'         # Establece la raíz de documentos (opcional)
  )

  # Definir un controlador para la ruta raíz "/"
  servidor.mount_proc '/' do |req, res|
    # Define la respuesta para la solicitud a la ruta raíz
    res.body = '¡Hola, mundo!'
    res.content_type = 'text/plain; charset=utf-8' # Asegura UTF-8
  end

  # Maneja la señal de interrupción para detener el servidor
  trap 'INT' do
    servidor.shutdown
  end

  # Iniciar el servidor
  servidor.start
end

# Función principal
def main
  puts 'Iniciando el servidor en el puerto 9095...'
  iniciar_servidor
end

# Punto de entrada para el script
if __FILE__ == $PROGRAM_NAME
  main
end
