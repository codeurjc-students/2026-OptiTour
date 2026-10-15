package es.urjc.tfg.optitour.security.jwt;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequest {
	@NotBlank(message = "El correo electrónico es obligatorio.")
	@Email(message = "El formato del correo no es válido.")
	@Size(max = 30, message = "El correo electrónico no puede superar los 30 caracteres.")
	private String email;

	@NotBlank(message = "La contraseña es obligatoria.")
	@Size(min = 8, max = 20, message = "La contraseña debe tener entre 8 y 20 caracteres")
	private String password;

	public LoginRequest() {
	}

	public LoginRequest(String email, String password) {
		this.email = email;
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		return "LoginRequest [email=" + email + ", password=" + password + "]";
	}
}
