import "../../../../styles/developers.css";
import Image from "next/image";
import franz from "../../../../public/franz.jpeg";
import giovanni from "../../../../public/giovanni.jpeg";
import lance from "../../../../public/lance.png";

export default function Developers() {
  return (
    <>
      <h1 className="title">Developers</h1>

      <div className="cards-wrapper">
        <div className="card">
          <Image
            className="img"
            src={franz}
            alt="franz"
            width={300}
            height={300}
            placeholder="blur"
          />
          <h1 className="name">Franz Zapanta</h1>
          <p className="description">BSCS-ST</p>
          <p className="social-link">
            <a href="https://github.com/Franz1033">
              <i className="bi bi-github"></i>
            </a>
          </p>
        </div>

        <div className="card">
          <Image
            className="img"
            src={giovanni}
            alt="giovanni"
            width={300}
            height={300}
            placeholder="blur"
          />
          <h1 className="name">Giovanni Cruz</h1>
          <p className="description">BSCS-ST</p>
          <p className="social-link">
            <a href="https://github.com/jey0C">
              <i className="bi bi-github"></i>
            </a>
          </p>
        </div>

        <div className="card">
          <Image
            className="img"
            src={lance}
            alt="lance"
            width={300}
            height={300}
            placeholder="blur"
          />
          <h1 className="name">Lance Colorina</h1>
          <p className="description">BSCS-ST</p>
          <p className="social-link">
            <a href="https://github.com/LanceColorina">
              <i className="bi bi-github"></i>
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
