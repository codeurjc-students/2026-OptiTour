import { Link, Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Button, Card, Carousel, Col, Container, Form, InputGroup, Nav, Navbar, Row } from "react-bootstrap";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.web.tsx
var entry_server_web_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, routerContext, _loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	let shellRendered = false;
	let userAgent = request.headers.get("user-agent");
	const body = await renderToReadableStream(/* @__PURE__ */ jsx(ServerRouter, {
		context: routerContext,
		url: request.url
	}), {
		signal: AbortSignal.timeout(6e3),
		onError(error) {
			responseStatusCode = 500;
			if (shellRendered) console.error(error);
		}
	});
	shellRendered = true;
	if (userAgent && isbot(userAgent) || routerContext.isSpaMode) await body.allReady;
	responseHeaders.set("Content-Type", "text/html");
	return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode
	});
}
//#endregion
//#region src/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	Layout: () => Layout,
	default: () => root_default
});
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "es",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "icon",
				type: "image/png",
				href: "/assets/favicon.png"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function Root() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
//#endregion
//#region src/assets/OptiTourLogo.png
var OptiTourLogo_default = "/assets/OptiTourLogo-DmaskPyi.png";
//#endregion
//#region src/components/Navbar/Navbar.tsx
/**
* Navbar global de OptiTour.
* El logo enlaza a la home (estándar de la industria).
*/
function OptiTourNavbar() {
	return /* @__PURE__ */ jsx(Navbar, {
		bg: "white",
		expand: "md",
		className: "ot-navbar",
		sticky: "top",
		children: /* @__PURE__ */ jsxs(Container, {
			fluid: true,
			className: "ot-navbar__container",
			children: [
				/* @__PURE__ */ jsx(Navbar.Brand, {
					as: Link,
					to: "/",
					className: "ot-navbar__brand",
					children: /* @__PURE__ */ jsx("img", {
						src: OptiTourLogo_default,
						alt: "OptiTour",
						className: "ot-navbar__logo"
					})
				}),
				/* @__PURE__ */ jsx(Navbar.Toggle, { "aria-controls": "ot-navbar-nav" }),
				/* @__PURE__ */ jsx(Navbar.Collapse, {
					id: "ot-navbar-nav",
					className: "justify-content-end",
					children: /* @__PURE__ */ jsxs(Nav, {
						className: "ot-navbar__actions",
						children: [/* @__PURE__ */ jsx(Link, {
							to: "/signup",
							className: "btn btn-outline-dark ot-navbar__btn ot-navbar__btn--outline",
							children: "Registrarse"
						}), /* @__PURE__ */ jsx(Link, {
							to: "/login",
							className: "btn btn-primary ot-navbar__btn ot-navbar__btn--fill",
							children: "Iniciar sesión"
						})]
					})
				})
			]
		})
	});
}
//#endregion
//#region src/components/Footer/Footer.tsx
function Footer() {
	return /* @__PURE__ */ jsx("footer", {
		className: "ot-footer",
		children: /* @__PURE__ */ jsxs(Container, {
			className: "ot-footer__container",
			children: [
				/* @__PURE__ */ jsxs(Row, {
					className: "ot-footer__top",
					children: [
						/* @__PURE__ */ jsxs(Col, {
							xs: 12,
							md: 4,
							className: "ot-footer__brand",
							children: [/* @__PURE__ */ jsx("img", {
								src: OptiTourLogo_default,
								alt: "OptiTour",
								className: "ot-footer__logo"
							}), /* @__PURE__ */ jsx("p", {
								className: "ot-footer__tagline",
								children: "Rutas turísticas optimizadas para aprovechar cada minuto de tu viaje."
							})]
						}),
						/* @__PURE__ */ jsxs(Col, {
							xs: 6,
							md: 4,
							className: "ot-footer__col",
							children: [/* @__PURE__ */ jsx("h6", {
								className: "ot-footer__heading",
								children: "Explorar"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "ot-footer__list",
								children: [
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
										to: "/",
										children: [/* @__PURE__ */ jsx("i", {
											className: "bi bi-compass",
											"aria-hidden": "true"
										}), "Tours destacados"]
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
										to: "/tours",
										children: [/* @__PURE__ */ jsx("i", {
											className: "bi bi-map",
											"aria-hidden": "true"
										}), "Todos los tours"]
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
										to: "/como-funciona",
										children: [/* @__PURE__ */ jsx("i", {
											className: "bi bi-question-circle",
											"aria-hidden": "true"
										}), "Cómo funciona"]
									}) })
								]
							})]
						}),
						/* @__PURE__ */ jsxs(Col, {
							xs: 6,
							md: 4,
							className: "ot-footer__col",
							children: [/* @__PURE__ */ jsx("h6", {
								className: "ot-footer__heading",
								children: "OptiTour"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "ot-footer__list",
								children: [
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", {
										href: "https://github.com/codeurjc-students/2026-OptiTour",
										target: "_blank",
										rel: "noreferrer",
										"aria-label": "Sobre nosotros en GitHub",
										children: [/* @__PURE__ */ jsx("i", {
											className: "bi bi-github",
											"aria-hidden": "true"
										}), "Sobre nosotros"]
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
										to: "/contacto",
										children: [/* @__PURE__ */ jsx("i", {
											className: "bi bi-envelope",
											"aria-hidden": "true"
										}), "Contacto"]
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
										to: "/login",
										children: [/* @__PURE__ */ jsx("i", {
											className: "bi bi-box-arrow-in-right",
											"aria-hidden": "true"
										}), "Iniciar sesión"]
									}) })
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ jsx("hr", { className: "ot-footer__divider" }),
				/* @__PURE__ */ jsx(Row, {
					className: "ot-footer__bottom",
					children: /* @__PURE__ */ jsx(Col, { children: /* @__PURE__ */ jsxs("span", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" OptiTour. Todos los derechos reservados."
					] }) })
				})
			]
		})
	});
}
//#endregion
//#region src/routes/home.tsx
var home_exports = /* @__PURE__ */ __exportAll({ default: () => home_default });
var home_default = UNSAFE_withComponentProps(function Home() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(OptiTourNavbar, {}),
		/* @__PURE__ */ jsx(Outlet, {}),
		/* @__PURE__ */ jsx(Footer, {})
	] });
});
//#endregion
//#region src/components/TourCard/TourCard.tsx
/**
* Tarjeta de tour usada en listados (home, resultados de búsqueda, etc.)
* Puramente de maqueta: recibe título, imagen opcional y destino del CTA.
*/
function TourCard({ title, imageSrc, to = "#" }) {
	return /* @__PURE__ */ jsxs(Card, {
		className: "ot-tour-card",
		children: [/* @__PURE__ */ jsx("div", {
			className: "ot-tour-card__image",
			children: imageSrc ? /* @__PURE__ */ jsx("img", {
				src: imageSrc,
				alt: title
			}) : /* @__PURE__ */ jsxs("span", {
				className: "ot-tour-card__placeholder",
				children: [
					"Imagen",
					/* @__PURE__ */ jsx("br", {}),
					title
				]
			})
		}), /* @__PURE__ */ jsxs(Card.Body, {
			className: "ot-tour-card__body",
			children: [/* @__PURE__ */ jsx(Card.Title, {
				className: "ot-tour-card__title",
				children: title
			}), /* @__PURE__ */ jsx(Link, {
				to,
				className: "btn btn-outline-success ot-tour-card__btn",
				children: "Ver más"
			})]
		})]
	});
}
//#endregion
//#region src/components/ImageCarousel/ImageCarousel.tsx
/**
* Carrusel reutilizable. Sin imageSrc muestra un degradado de marca a modo
* de placeholder (primary/dark); con imageSrc muestra la imagen real
* (para cuando tengas fotos reales de tours/POIs en BD).
*/
function ImageCarousel({ slides, className = "" }) {
	return /* @__PURE__ */ jsx(Carousel, {
		className: `ot-carousel ${className}`,
		indicators: false,
		children: slides.map((slide, index) => /* @__PURE__ */ jsx(Carousel.Item, { children: slide.imageSrc ? /* @__PURE__ */ jsxs("div", {
			className: "ot-carousel__slide ot-carousel__slide--image",
			children: [/* @__PURE__ */ jsx("img", {
				src: slide.imageSrc,
				alt: slide.title
			}), (slide.eyebrow || slide.title) && /* @__PURE__ */ jsxs("div", {
				className: "ot-carousel__slide-caption",
				children: [slide.eyebrow && /* @__PURE__ */ jsx("span", {
					className: "ot-carousel__slide-eyebrow",
					children: slide.eyebrow
				}), /* @__PURE__ */ jsx("h2", {
					className: "ot-carousel__slide-title",
					children: slide.title
				})]
			})]
		}) : /* @__PURE__ */ jsxs("div", {
			className: `ot-carousel__slide ot-carousel__slide--${slide.variant ?? "primary"}`,
			children: [slide.eyebrow && /* @__PURE__ */ jsx("span", {
				className: "ot-carousel__slide-eyebrow",
				children: slide.eyebrow
			}), /* @__PURE__ */ jsx("h2", {
				className: "ot-carousel__slide-title",
				children: slide.title
			})]
		}) }, index))
	});
}
//#endregion
//#region src/routes/Index/Index.tsx
var Index_exports = /* @__PURE__ */ __exportAll({ default: () => Index_default });
var tours = [
	{
		id: 1,
		title: "Tour público 1"
	},
	{
		id: 2,
		title: "Tour público 2"
	},
	{
		id: 3,
		title: "Tour público 3"
	},
	{
		id: 4,
		title: "Tour público 4"
	}
];
function Index() {
	return /* @__PURE__ */ jsxs(Container, {
		className: "ot-index",
		children: [
			/* @__PURE__ */ jsx(Form, {
				className: "ot-index__search",
				children: /* @__PURE__ */ jsxs(InputGroup, { children: [/* @__PURE__ */ jsx(InputGroup.Text, {
					className: "ot-index__search-icon",
					children: /* @__PURE__ */ jsxs("svg", {
						width: "18",
						height: "18",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						children: [/* @__PURE__ */ jsx("circle", {
							cx: "11",
							cy: "11",
							r: "7"
						}), /* @__PURE__ */ jsx("line", {
							x1: "21",
							y1: "21",
							x2: "16.65",
							y2: "16.65"
						})]
					})
				}), /* @__PURE__ */ jsx(Form.Control, {
					placeholder: "Escribe aquí para buscar",
					"aria-label": "Buscar tours"
				})] })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "ot-index__carousel",
				children: /* @__PURE__ */ jsx(ImageCarousel, { slides: [{
					eyebrow: "Carrusel de imágenes",
					title: "Tours destacados",
					variant: "primary"
				}, {
					eyebrow: "Carrusel de imágenes",
					title: "Descubre nuevas rutas",
					variant: "dark"
				}] })
			}),
			/* @__PURE__ */ jsx(Row, {
				className: "ot-index__grid",
				xs: 1,
				sm: 2,
				md: 4,
				children: tours.map((tour) => /* @__PURE__ */ jsx(Col, {
					className: "ot-index__grid-item",
					children: /* @__PURE__ */ jsx(TourCard, {
						title: tour.title,
						to: "/tourdetail"
					})
				}, tour.id))
			})
		]
	});
}
var Index_default = UNSAFE_withComponentProps(Index);
//#endregion
//#region src/routes/Signup/Signup.tsx
var Signup_exports = /* @__PURE__ */ __exportAll({ default: () => Signup_default });
/**
* Registro de usuario. Al igual que Login, va fuera de MainLayout.
* La cabecera (marca + "volver") se resuelve con la lógica condicional
* del Navbar que comentaste, así que aquí no se incluye.
*/
function Signup() {
	return /* @__PURE__ */ jsx("div", {
		className: "ot-register",
		children: /* @__PURE__ */ jsxs(Container, {
			className: "ot-register__container",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "ot-register__title",
					children: "Registro de usuario"
				}),
				/* @__PURE__ */ jsx(Card, {
					className: "ot-register__card ot-register__card--main",
					children: /* @__PURE__ */ jsxs(Row, {
						className: "g-4",
						children: [/* @__PURE__ */ jsxs(Col, {
							md: 4,
							className: "ot-register__avatar-col",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "ot-register__avatar",
									children: /* @__PURE__ */ jsxs("span", { children: [
										"Imagen",
										/* @__PURE__ */ jsx("br", {}),
										"de perfil"
									] })
								}),
								/* @__PURE__ */ jsx("span", {
									className: "ot-register__avatar-label",
									children: "Foto de perfil"
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "outline-dark",
									className: "ot-register__upload-btn",
									children: "Subir archivo"
								})
							]
						}), /* @__PURE__ */ jsx(Col, {
							md: 8,
							children: /* @__PURE__ */ jsxs(Row, {
								className: "g-3",
								children: [
									/* @__PURE__ */ jsx(Col, {
										sm: 6,
										children: /* @__PURE__ */ jsxs(Form.Group, {
											controlId: "registerEmail",
											children: [/* @__PURE__ */ jsx(Form.Label, { children: "Correo electrónico" }), /* @__PURE__ */ jsx(Form.Control, { type: "email" })]
										})
									}),
									/* @__PURE__ */ jsx(Col, {
										sm: 6,
										children: /* @__PURE__ */ jsxs(Form.Group, {
											controlId: "registerPhone",
											children: [/* @__PURE__ */ jsx(Form.Label, { children: "Número de teléfono" }), /* @__PURE__ */ jsx(Form.Control, { type: "tel" })]
										})
									}),
									/* @__PURE__ */ jsx(Col, {
										xs: 12,
										children: /* @__PURE__ */ jsxs(Form.Group, {
											controlId: "registerUsername",
											children: [/* @__PURE__ */ jsx(Form.Label, { children: "Nombre de usuario" }), /* @__PURE__ */ jsx(Form.Control, { type: "text" })]
										})
									})
								]
							})
						})]
					})
				}),
				/* @__PURE__ */ jsxs(Row, {
					className: "g-4 ot-register__bottom",
					children: [/* @__PURE__ */ jsx(Col, {
						md: 6,
						children: /* @__PURE__ */ jsxs(Card, {
							className: "ot-register__card ot-register__card--password",
							children: [/* @__PURE__ */ jsxs(Form.Group, {
								controlId: "registerPassword",
								className: "ot-register__field",
								children: [/* @__PURE__ */ jsx(Form.Label, { children: "Contraseña" }), /* @__PURE__ */ jsxs("div", {
									className: "ot-register__input-icon",
									children: [/* @__PURE__ */ jsx(Form.Control, { type: "password" }), /* @__PURE__ */ jsxs("svg", {
										width: "18",
										height: "18",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										children: [/* @__PURE__ */ jsx("path", { d: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" }), /* @__PURE__ */ jsx("line", {
											x1: "4",
											y1: "20",
											x2: "20",
											y2: "4"
										})]
									})]
								})]
							}), /* @__PURE__ */ jsxs(Form.Group, {
								controlId: "registerPasswordRepeat",
								className: "ot-register__field",
								children: [/* @__PURE__ */ jsx(Form.Label, { children: "Repetir contraseña" }), /* @__PURE__ */ jsxs("div", {
									className: "ot-register__input-icon",
									children: [/* @__PURE__ */ jsx(Form.Control, { type: "password" }), /* @__PURE__ */ jsxs("svg", {
										width: "18",
										height: "18",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										children: [/* @__PURE__ */ jsx("path", { d: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" }), /* @__PURE__ */ jsx("line", {
											x1: "4",
											y1: "20",
											x2: "20",
											y2: "4"
										})]
									})]
								})]
							})]
						})
					}), /* @__PURE__ */ jsx(Col, {
						md: 6,
						children: /* @__PURE__ */ jsxs(Card, {
							className: "ot-register__card ot-register__card--actions",
							children: [
								/* @__PURE__ */ jsx(Button, {
									type: "submit",
									className: "ot-register__submit",
									children: "Crear Cuenta"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "ot-register__login-text",
									children: "O inicia sesión si ya tienes cuenta:"
								}),
								/* @__PURE__ */ jsx(Link, {
									to: "/login",
									className: "btn btn-outline-dark ot-register__login-btn",
									children: "Iniciar sesión"
								})
							]
						})
					})]
				})
			]
		})
	});
}
var Signup_default = UNSAFE_withComponentProps(Signup);
//#endregion
//#region src/components/ListItem/ListItem.tsx
/**
* Fila genérica con miniatura + título y acción opcional.
* Se usa para puntos de interés dentro de un tour, tours dentro de un
* punto de interés, y cualquier listado similar.
*/
function ListItem({ title, imageSrc, to = "#", actionLabel, size = "md" }) {
	const content = /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("div", {
			className: "ot-list-item__thumb",
			children: imageSrc ? /* @__PURE__ */ jsx("img", {
				src: imageSrc,
				alt: title
			}) : /* @__PURE__ */ jsx("span", { children: "Img" })
		}),
		/* @__PURE__ */ jsx("span", {
			className: "ot-list-item__title",
			children: title
		}),
		actionLabel && /* @__PURE__ */ jsx(Link, {
			to,
			className: "btn btn-outline-success ot-list-item__btn",
			children: actionLabel
		})
	] });
	const className = `ot-list-item ot-list-item--${size}`;
	if (!actionLabel) return /* @__PURE__ */ jsx(Link, {
		to,
		className: `${className} ot-list-item--link`,
		children: content
	});
	return /* @__PURE__ */ jsx("div", {
		className,
		children: content
	});
}
//#endregion
//#region src/components/GroupListItem/GroupListItem.tsx
/** Fila de grupo, con acción opcional a la derecha. */
function GroupListItem({ name, action }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "ot-group-item",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "ot-group-item__icon",
				children: /* @__PURE__ */ jsxs("svg", {
					width: "20",
					height: "20",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					children: [
						/* @__PURE__ */ jsx("circle", {
							cx: "9",
							cy: "8",
							r: "3"
						}),
						/* @__PURE__ */ jsx("path", { d: "M2 20c0-3 3-5 7-5s7 2 7 5" }),
						/* @__PURE__ */ jsx("circle", {
							cx: "17",
							cy: "9",
							r: "2.5"
						}),
						/* @__PURE__ */ jsx("path", { d: "M15.5 13.2c2.8.4 4.5 2.1 4.5 4.3" })
					]
				})
			}),
			/* @__PURE__ */ jsx("span", {
				className: "ot-group-item__name",
				children: name
			}),
			action && /* @__PURE__ */ jsx("div", {
				className: "ot-group-item__action",
				children: action
			})
		]
	});
}
//#endregion
//#region src/routes/TourDetail/TourDetail.tsx
var TourDetail_exports = /* @__PURE__ */ __exportAll({ default: () => TourDetail_default });
var pointsOfInterest = [
	{
		id: 1,
		title: "Punto de interés 1"
	},
	{
		id: 2,
		title: "Punto de interés 2"
	},
	{
		id: 3,
		title: "Punto de interés 3"
	}
];
var publicGroups = ["Grupo 1", "Grupo 2"];
/**
* Detalle de un tour PÚBLICO visto SIN sesión iniciada.
* Para apuntarse hace falta grupo + sesión iniciada, de ahí el aviso del
* lateral. La versión con sesión iniciada llegará más adelante.
*/
function TourDetailPage() {
	return /* @__PURE__ */ jsxs(Container, {
		className: "ot-tour-detail",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "ot-tour-detail__title",
			children: "Título del Tour"
		}), /* @__PURE__ */ jsxs(Row, {
			className: "g-4",
			children: [/* @__PURE__ */ jsxs(Col, {
				lg: 8,
				children: [
					/* @__PURE__ */ jsx(ImageCarousel, { slides: [{
						title: "Carrusel de imágenes del Tour",
						variant: "primary"
					}] }),
					/* @__PURE__ */ jsxs("div", {
						className: "ot-tour-detail__info",
						children: [/* @__PURE__ */ jsx("p", {
							className: "ot-tour-detail__description",
							children: "Descripción del Tour"
						}), /* @__PURE__ */ jsx("p", {
							className: "ot-tour-detail__price",
							children: "Precio del tour (si procede)"
						})]
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "ot-tour-detail__poi-heading",
						children: "Lista de puntos de interés (ordenados en orden de visita)"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "ot-tour-detail__poi-list",
						children: pointsOfInterest.map((poi) => /* @__PURE__ */ jsx(ListItem, {
							title: poi.title,
							to: `/poidetail`,
							actionLabel: "Ver más"
						}, poi.id))
					})
				]
			}), /* @__PURE__ */ jsxs(Col, {
				lg: 4,
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "ot-tour-detail__sidebar-card",
					children: [/* @__PURE__ */ jsx("span", {
						className: "ot-tour-detail__sidebar-heading",
						children: "Grupos públicos"
					}), publicGroups.map((group) => /* @__PURE__ */ jsx(GroupListItem, { name: group }, group))]
				}), /* @__PURE__ */ jsx(Card, {
					className: "ot-tour-detail__sidebar-card ot-tour-detail__cta-card",
					children: /* @__PURE__ */ jsx(Button, {
						variant: "outline-dark",
						className: "ot-tour-detail__cta-btn",
						children: "Iniciar sesión para apuntarse"
					})
				})]
			})]
		})]
	});
}
var TourDetail_default = UNSAFE_withComponentProps(TourDetailPage);
//#endregion
//#region src/routes/PointOfInterestDetail/PointOfInterestDetail.tsx
var PointOfInterestDetail_exports = /* @__PURE__ */ __exportAll({ default: () => PointOfInterestDetail_default });
var relatedTours = [
	{
		id: 1,
		title: "Tour 1"
	},
	{
		id: 2,
		title: "Tour 2"
	},
	{
		id: 3,
		title: "Tour 3"
	},
	{
		id: 4,
		title: "Tour 4"
	},
	{
		id: 5,
		title: "Tour 5"
	}
];
/** Detalle de un punto de interés: carrusel, datos y tours donde se visita. */
function PointOfInterestDetailPage() {
	return /* @__PURE__ */ jsxs(Container, {
		className: "ot-poi-detail",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "ot-poi-detail__title",
			children: "Título del punto de interés"
		}), /* @__PURE__ */ jsxs(Row, {
			className: "g-4",
			children: [/* @__PURE__ */ jsxs(Col, {
				lg: 7,
				children: [/* @__PURE__ */ jsx(ImageCarousel, { slides: [{
					title: "Carrusel de imágenes del punto de interés",
					variant: "primary"
				}] }), /* @__PURE__ */ jsxs("dl", {
					className: "ot-poi-detail__data",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "ot-poi-detail__data-row",
							children: [/* @__PURE__ */ jsx("dt", { children: "Descripción" }), /* @__PURE__ */ jsx("dd", { children: "Descripción del punto de interés" })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "ot-poi-detail__data-row",
							children: [/* @__PURE__ */ jsx("dt", { children: "Ciudad y dirección" }), /* @__PURE__ */ jsx("dd", { children: "Ciudad y dirección" })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "ot-poi-detail__data-row",
							children: [/* @__PURE__ */ jsx("dt", { children: "Coordenadas" }), /* @__PURE__ */ jsx("dd", { children: "Coordenadas" })]
						})
					]
				})]
			}), /* @__PURE__ */ jsx(Col, {
				lg: 5,
				children: /* @__PURE__ */ jsxs(Card, {
					className: "ot-poi-detail__sidebar-card",
					children: [/* @__PURE__ */ jsx("span", {
						className: "ot-poi-detail__sidebar-heading",
						children: "Tours en los que se visita"
					}), /* @__PURE__ */ jsx("div", {
						className: "ot-poi-detail__tour-list",
						children: relatedTours.map((tour) => /* @__PURE__ */ jsx(ListItem, {
							title: tour.title,
							to: `/tourdetail`,
							actionLabel: "Ver más",
							size: "sm"
						}, tour.id))
					})]
				})
			})]
		})]
	});
}
var PointOfInterestDetail_default = UNSAFE_withComponentProps(PointOfInterestDetailPage);
//#endregion
//#region src/components/ProfileSideBar/ProfileSideBar.tsx
/**
* Sidebar del área personal. Reutilizable para el panel de usuario y el de
* administrador: basta con pasarle otra lista de items.
*/
function ProfileSidebar({ userName, avatarSrc, items, footerItems = [], profileTo = "/profile" }) {
	return /* @__PURE__ */ jsxs("aside", {
		className: "ot-sidebar",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "ot-sidebar__user",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "ot-sidebar__avatar",
						children: avatarSrc ? /* @__PURE__ */ jsx("img", {
							src: avatarSrc,
							alt: userName
						}) : /* @__PURE__ */ jsxs("svg", {
							width: "44",
							height: "44",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1.5",
							children: [/* @__PURE__ */ jsx("circle", {
								cx: "12",
								cy: "9",
								r: "3.5"
							}), /* @__PURE__ */ jsx("path", { d: "M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" })]
						})
					}),
					/* @__PURE__ */ jsx("span", {
						className: "ot-sidebar__username",
						children: userName
					}),
					/* @__PURE__ */ jsx(Link, {
						to: profileTo,
						className: "btn btn-outline-dark ot-sidebar__profile-btn",
						children: "Ver mi perfil"
					})
				]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "ot-sidebar__nav",
				children: items.map((item) => /* @__PURE__ */ jsxs(NavLink, {
					to: item.to,
					className: ({ isActive }) => `ot-sidebar__link${isActive ? " ot-sidebar__link--active" : ""}`,
					children: [item.icon && /* @__PURE__ */ jsx("span", {
						className: "ot-sidebar__link-icon",
						children: item.icon
					}), item.label]
				}, item.to))
			}),
			footerItems.length > 0 && /* @__PURE__ */ jsx("nav", {
				className: "ot-sidebar__nav ot-sidebar__nav--footer",
				children: footerItems.map((item) => /* @__PURE__ */ jsxs(NavLink, {
					to: item.to,
					className: ({ isActive }) => `ot-sidebar__link${isActive ? " ot-sidebar__link--active" : ""}`,
					children: [item.icon && /* @__PURE__ */ jsx("span", {
						className: "ot-sidebar__link-icon",
						children: item.icon
					}), item.label]
				}, item.to))
			})
		]
	});
}
//#endregion
//#region src/layouts/ProfileLayout.tsx
var ProfileLayout_exports = /* @__PURE__ */ __exportAll({ default: () => ProfileLayout_default });
var bellIcon = /* @__PURE__ */ jsxs("svg", {
	width: "20",
	height: "20",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	children: [/* @__PURE__ */ jsx("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }), /* @__PURE__ */ jsx("path", { d: "M13.7 21a2 2 0 0 1-3.4 0" })]
});
var userMenu = [
	{
		label: "Lista de amigos",
		to: "/profile/friends"
	},
	{
		label: "Mis grupos",
		to: "/perfil/grupos"
	},
	{
		label: "Mis tours",
		to: "/perfil/tours"
	},
	{
		label: "Mis pagos",
		to: "/perfil/pagos"
	}
];
var userFooterMenu = [{
	label: "Notificaciones",
	to: "/perfil/notificaciones",
	icon: bellIcon
}];
/**
* Layout del área personal. Fuera de MainLayout: sin navbar ni footer.
* Sidebar fijo + <Outlet /> para cada pantalla del panel.
*/
function ProfileLayout() {
	return /* @__PURE__ */ jsxs("div", {
		className: "ot-profile-layout",
		children: [/* @__PURE__ */ jsx(ProfileSidebar, {
			userName: "Nombre de usuario",
			items: userMenu,
			footerItems: userFooterMenu
		}), /* @__PURE__ */ jsx("main", {
			className: "ot-profile-layout__content",
			children: /* @__PURE__ */ jsx(Outlet, {})
		})]
	});
}
var ProfileLayout_default = UNSAFE_withComponentProps(ProfileLayout);
//#endregion
//#region src/routes/MyProfile/MyProfile.tsx
var MyProfile_exports = /* @__PURE__ */ __exportAll({ default: () => MyProfile_default });
function MyProfile() {
	return /* @__PURE__ */ jsxs("div", {
		className: "ot-my-profile",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "ot-panel-title text-center",
				children: "Mi perfil"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "ot-my-profile__avatar",
				children: /* @__PURE__ */ jsxs("svg", {
					width: "80",
					height: "80",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.5",
					children: [/* @__PURE__ */ jsx("circle", {
						cx: "12",
						cy: "9",
						r: "3.5"
					}), /* @__PURE__ */ jsx("path", { d: "M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" })]
				})
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "ot-my-profile__name",
				children: "Nombre de usuario"
			}),
			/* @__PURE__ */ jsxs("dl", {
				className: "ot-my-profile__data",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Correo electrónico" }), /* @__PURE__ */ jsx("dd", { children: "correo@ejemplo.com" })] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", { children: "Número de teléfono" }), /* @__PURE__ */ jsx("dd", { children: "600 000 000" })] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "ot-my-profile__actions",
				children: [
					/* @__PURE__ */ jsx(Button, {
						variant: "outline-dark",
						className: "ot-my-profile__edit-btn",
						children: "Editar información de mi cuenta"
					}),
					/* @__PURE__ */ jsx(Button, {
						variant: "outline-dark",
						className: "ot-my-profile__password-btn",
						children: "Cambiar mi contraseña"
					}),
					/* @__PURE__ */ jsx(Button, {
						variant: "outline-danger",
						className: "ot-my-profile__delete-btn",
						children: "Eliminar mi cuenta"
					})
				]
			})
		]
	});
}
var MyProfile_default = UNSAFE_withComponentProps(MyProfile);
//#endregion
//#region src/components/PanelSearch/PanelSearch.tsx
function PanelSearch({ placeholder }) {
	return /* @__PURE__ */ jsx(Form, {
		className: "ot-panel-search",
		children: /* @__PURE__ */ jsxs(InputGroup, { children: [/* @__PURE__ */ jsx(InputGroup.Text, { children: /* @__PURE__ */ jsxs("svg", {
			width: "18",
			height: "18",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			children: [/* @__PURE__ */ jsx("circle", {
				cx: "11",
				cy: "11",
				r: "7"
			}), /* @__PURE__ */ jsx("line", {
				x1: "21",
				y1: "21",
				x2: "16.65",
				y2: "16.65"
			})]
		}) }), /* @__PURE__ */ jsx(Form.Control, {
			placeholder,
			"aria-label": placeholder
		})] })
	});
}
//#endregion
//#region src/components/UserListItem/UserListItem.tsx
function UserListItem({ userName, avatarSrc, actions }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "ot-user-item",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "ot-user-item__avatar",
				children: avatarSrc ? /* @__PURE__ */ jsx("img", {
					src: avatarSrc,
					alt: userName
				}) : /* @__PURE__ */ jsxs("svg", {
					width: "22",
					height: "22",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.5",
					children: [/* @__PURE__ */ jsx("circle", {
						cx: "12",
						cy: "9",
						r: "3.5"
					}), /* @__PURE__ */ jsx("path", { d: "M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" })]
				})
			}),
			/* @__PURE__ */ jsx("span", {
				className: "ot-user-item__name",
				children: userName
			}),
			actions && /* @__PURE__ */ jsx("div", {
				className: "ot-user-item__actions",
				children: actions
			})
		]
	});
}
//#endregion
//#region src/routes/MyFriends/MyFriends.tsx
var MyFriends_exports = /* @__PURE__ */ __exportAll({ default: () => MyFriends_default });
var friends = [
	"<<Nombre de usuario 1>>",
	"<<Nombre de usuario 2>>",
	"<<Nombre de usuario 3>>",
	"<<Nombre de usuario 4>>",
	"<<Nombre de usuario 5>>"
];
function MyFriends() {
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("h1", {
			className: "ot-panel-title",
			children: "Lista de amigos"
		}),
		/* @__PURE__ */ jsx(PanelSearch, { placeholder: "Buscar amigos por nombre" }),
		friends.map((name) => /* @__PURE__ */ jsx(UserListItem, {
			userName: name,
			actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Button, {
				variant: "outline-danger",
				children: "Eliminar"
			}), /* @__PURE__ */ jsx(Button, {
				variant: "outline-dark",
				children: "Ver perfil"
			})] })
		}, name))
	] });
}
var MyFriends_default = UNSAFE_withComponentProps(MyFriends);
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-CuwiQYyJ.js",
		"imports": [
			"/assets/jsx-runtime-9rq892Qr.js",
			"/assets/react-dom-h9iXOlFH.js",
			"/assets/errorBoundaries-CHaBXAbH.js"
		],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/root-DJxqsO3f.js",
			"imports": [
				"/assets/jsx-runtime-9rq892Qr.js",
				"/assets/react-dom-h9iXOlFH.js",
				"/assets/errorBoundaries-CHaBXAbH.js",
				"/assets/lib-xXNOJKfj.js"
			],
			"css": ["/assets/root-D0qzeBt-.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home": {
			"id": "routes/home",
			"parentId": "root",
			"path": void 0,
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/home-dRmq9_vb.js",
			"imports": [
				"/assets/jsx-runtime-9rq892Qr.js",
				"/assets/react-dom-h9iXOlFH.js",
				"/assets/lib-xXNOJKfj.js",
				"/assets/Button-lAOJlj7V.js",
				"/assets/Anchor-Dw7pHKcp.js",
				"/assets/prop-types-BON2wXRw.js",
				"/assets/Row-wgdeb-hp.js",
				"/assets/Col-BJk13n_u.js",
				"/assets/errorBoundaries-CHaBXAbH.js"
			],
			"css": ["/assets/home-JmVBm6Tv.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/Index/Index": {
			"id": "routes/Index/Index",
			"parentId": "routes/home",
			"path": "/",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/Index-DK9X_NtB.js",
			"imports": [
				"/assets/jsx-runtime-9rq892Qr.js",
				"/assets/lib-xXNOJKfj.js",
				"/assets/Row-wgdeb-hp.js",
				"/assets/Card-CRCyuPbl.js",
				"/assets/ImageCarousel-BxA5lvRY.js",
				"/assets/Col-BJk13n_u.js",
				"/assets/Form-B9-wp1Dc.js",
				"/assets/InputGroup-DNXM2sEp.js",
				"/assets/errorBoundaries-CHaBXAbH.js",
				"/assets/Button-lAOJlj7V.js",
				"/assets/Anchor-Dw7pHKcp.js",
				"/assets/ElementChildren-3STa889E.js",
				"/assets/react-dom-h9iXOlFH.js",
				"/assets/prop-types-BON2wXRw.js"
			],
			"css": ["/assets/Index-DvgCWPLn.css", "/assets/ImageCarousel-DcXJpIq3.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/Signup/Signup": {
			"id": "routes/Signup/Signup",
			"parentId": "routes/home",
			"path": "/signup",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/Signup-CgD7nKWl.js",
			"imports": [
				"/assets/jsx-runtime-9rq892Qr.js",
				"/assets/lib-xXNOJKfj.js",
				"/assets/Row-wgdeb-hp.js",
				"/assets/Button-Ca5CFiR3.js",
				"/assets/Card-CRCyuPbl.js",
				"/assets/Col-BJk13n_u.js",
				"/assets/Form-B9-wp1Dc.js",
				"/assets/errorBoundaries-CHaBXAbH.js",
				"/assets/Button-lAOJlj7V.js",
				"/assets/prop-types-BON2wXRw.js",
				"/assets/ElementChildren-3STa889E.js"
			],
			"css": ["/assets/Signup-C6EKAp8u.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/TourDetail/TourDetail": {
			"id": "routes/TourDetail/TourDetail",
			"parentId": "routes/home",
			"path": "/tourdetail",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/TourDetail-DUh_i9q8.js",
			"imports": [
				"/assets/jsx-runtime-9rq892Qr.js",
				"/assets/Row-wgdeb-hp.js",
				"/assets/Button-Ca5CFiR3.js",
				"/assets/Card-CRCyuPbl.js",
				"/assets/ImageCarousel-BxA5lvRY.js",
				"/assets/Col-BJk13n_u.js",
				"/assets/ListItem-BC8Y_QsL.js",
				"/assets/Button-lAOJlj7V.js",
				"/assets/Anchor-Dw7pHKcp.js",
				"/assets/ElementChildren-3STa889E.js",
				"/assets/react-dom-h9iXOlFH.js",
				"/assets/lib-xXNOJKfj.js",
				"/assets/errorBoundaries-CHaBXAbH.js"
			],
			"css": [
				"/assets/TourDetail-dY7kZRgV.css",
				"/assets/ImageCarousel-DcXJpIq3.css",
				"/assets/ListItem-CBF_ApNd.css"
			],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/PointOfInterestDetail/PointOfInterestDetail": {
			"id": "routes/PointOfInterestDetail/PointOfInterestDetail",
			"parentId": "routes/home",
			"path": "/poidetail",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/PointOfInterestDetail-7pax31Dk.js",
			"imports": [
				"/assets/jsx-runtime-9rq892Qr.js",
				"/assets/Row-wgdeb-hp.js",
				"/assets/Card-CRCyuPbl.js",
				"/assets/ImageCarousel-BxA5lvRY.js",
				"/assets/Col-BJk13n_u.js",
				"/assets/ListItem-BC8Y_QsL.js",
				"/assets/Button-lAOJlj7V.js",
				"/assets/Anchor-Dw7pHKcp.js",
				"/assets/ElementChildren-3STa889E.js",
				"/assets/react-dom-h9iXOlFH.js",
				"/assets/lib-xXNOJKfj.js",
				"/assets/errorBoundaries-CHaBXAbH.js"
			],
			"css": [
				"/assets/PointOfInterestDetail-BUAwOhNz.css",
				"/assets/ImageCarousel-DcXJpIq3.css",
				"/assets/ListItem-CBF_ApNd.css"
			],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"layouts/ProfileLayout": {
			"id": "layouts/ProfileLayout",
			"parentId": "root",
			"path": void 0,
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/ProfileLayout-BQYsV4VV.js",
			"imports": [
				"/assets/jsx-runtime-9rq892Qr.js",
				"/assets/lib-xXNOJKfj.js",
				"/assets/errorBoundaries-CHaBXAbH.js"
			],
			"css": ["/assets/ProfileLayout-BGTrpnkk.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/MyProfile/MyProfile": {
			"id": "routes/MyProfile/MyProfile",
			"parentId": "layouts/ProfileLayout",
			"path": "/profile",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/MyProfile-Dw6s_q-4.js",
			"imports": [
				"/assets/jsx-runtime-9rq892Qr.js",
				"/assets/Button-Ca5CFiR3.js",
				"/assets/Button-lAOJlj7V.js"
			],
			"css": ["/assets/MyProfile-DIA0ee1v.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/MyFriends/MyFriends": {
			"id": "routes/MyFriends/MyFriends",
			"parentId": "layouts/ProfileLayout",
			"path": "/profile/friends",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/MyFriends-BRuBwuUR.js",
			"imports": [
				"/assets/jsx-runtime-9rq892Qr.js",
				"/assets/Button-Ca5CFiR3.js",
				"/assets/Form-B9-wp1Dc.js",
				"/assets/InputGroup-DNXM2sEp.js",
				"/assets/Button-lAOJlj7V.js",
				"/assets/prop-types-BON2wXRw.js",
				"/assets/ElementChildren-3STa889E.js",
				"/assets/Col-BJk13n_u.js"
			],
			"css": ["/assets/MyFriends-CdUvGVPZ.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-c2f2d327.js",
	"version": "c2f2d327",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = {
	"unstable_enableNodeReadableStream": false,
	"unstable_optimizeDeps": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_web_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/home": {
		id: "routes/home",
		parentId: "root",
		path: void 0,
		index: void 0,
		caseSensitive: void 0,
		module: home_exports
	},
	"routes/Index/Index": {
		id: "routes/Index/Index",
		parentId: "routes/home",
		path: "/",
		index: void 0,
		caseSensitive: void 0,
		module: Index_exports
	},
	"routes/Signup/Signup": {
		id: "routes/Signup/Signup",
		parentId: "routes/home",
		path: "/signup",
		index: void 0,
		caseSensitive: void 0,
		module: Signup_exports
	},
	"routes/TourDetail/TourDetail": {
		id: "routes/TourDetail/TourDetail",
		parentId: "routes/home",
		path: "/tourdetail",
		index: void 0,
		caseSensitive: void 0,
		module: TourDetail_exports
	},
	"routes/PointOfInterestDetail/PointOfInterestDetail": {
		id: "routes/PointOfInterestDetail/PointOfInterestDetail",
		parentId: "routes/home",
		path: "/poidetail",
		index: void 0,
		caseSensitive: void 0,
		module: PointOfInterestDetail_exports
	},
	"layouts/ProfileLayout": {
		id: "layouts/ProfileLayout",
		parentId: "root",
		path: void 0,
		index: void 0,
		caseSensitive: void 0,
		module: ProfileLayout_exports
	},
	"routes/MyProfile/MyProfile": {
		id: "routes/MyProfile/MyProfile",
		parentId: "layouts/ProfileLayout",
		path: "/profile",
		index: void 0,
		caseSensitive: void 0,
		module: MyProfile_exports
	},
	"routes/MyFriends/MyFriends": {
		id: "routes/MyFriends/MyFriends",
		parentId: "layouts/ProfileLayout",
		path: "/profile/friends",
		index: void 0,
		caseSensitive: void 0,
		module: MyFriends_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
