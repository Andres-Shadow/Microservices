import hudson.security.*
import jenkins.model.*

def instance = Jenkins.getInstance()
if (!instance.isUseSecurity()) {  // Solo si no hay configuración de seguridad
    def realm = new HudsonPrivateSecurityRealm(false)
    instance.setSecurityRealm(realm)
    
    def user = realm.createAccount("admin", "admin123")  // Usuario y contraseña
    def strategy = new hudson.security.FullControlOnceLoggedInAuthorizationStrategy()
    instance.setAuthorizationStrategy(strategy)
    
    instance.save()
}
