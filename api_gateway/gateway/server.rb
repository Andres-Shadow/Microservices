require 'webrick'
require 'net/http'

# Función para normalizar los encabezados HTTP
def normalizar_encabezados(header)
  # Convierte los valores que son Arrays en cadenas o los une si es necesario
  header.transform_values do |value|
    if value.is_a?(Array)
      value.join(", ") # Une múltiples valores en una cadena
    else
      value
    end
  end
end

# Función para redirigir la solicitud y devolver la respuesta
def redirigir_solicitud(destino, req, res)
  # Crear la solicitud HTTP para el destino
  uri = URI(destino)
  http = Net::HTTP.new(uri.host, uri.port)

  # Crear la solicitud basada en el método de la solicitud original
  http_request = case req.request_method
                 when 'GET'
                   Net::HTTP::Get.new(uri)
                 when 'POST'
                   request = Net::HTTP::Post.new(uri)
                   request.body = req.body
                   request.content_type = req.content_type
                   request
                 when 'PUT'
                   request = Net::HTTP::Put.new(uri)
                   request.body = req.body
                   request.content_type = req.content_type
                   request
                 when 'DELETE'
                   request = Net::HTTP::Delete.new(uri)
                   request.body = req.body
                   request.content_type = req.content_type
                   request
                 else
                   raise "Método HTTP no soportado: #{req.request_method}"
                 end

  # Normalizar los encabezados antes de pasarlos a initialize_http_header
  encabezados_limpios = normalizar_encabezados(req.header)
  http_request.initialize_http_header(encabezados_limpios)

  # Enviar la solicitud al destino
  http_response = http.request(http_request)

  # Configurar la respuesta para el cliente
  res.status = http_response.code.to_i
  res.body = http_response.body
  res.content_type = http_response.content_type
  http_response.each_header { |key, value| res[key] = value }
end

# Crear el servidor WEBrick
def iniciar_servidor
  servidor = WEBrick::HTTPServer.new(Port: 9095)

  # Ruta para redirigir a la operación de autenticación
    servidor.mount_proc '/api/v1/users' do |req, res|
        redirigir_solicitud("http://localhost:9090/api/v1/users/", req, res)
    end

    servidor.mount_proc '/api/v1/users/login' do |req, res|
        redirigir_solicitud("http://localhost:9090/api/v1/login", req, res)
    end

  # Manejar la señal de interrupción para detener el servidor
  trap 'INT' do
    servidor.shutdown
  end

  # Iniciar el servidor
  servidor.start
end

# Punto de entrada para el script
if __FILE__ == $PROGRAM_NAME
  iniciar_servidor
end
