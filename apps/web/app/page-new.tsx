import Image from "next/image";
import Link from "next/link";
import { samples, categories } from "../lib/samples";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Motion Playground</h1>
          <p className={styles.subtitle}>
            Interactive examples using @t2421/motion package
          </p>
        </div>

        <div className={styles.samples}>
          <h2>Sample Gallery</h2>
          
          {Object.entries(categories).map(([categoryKey, categoryName]) => {
            const categorySamples = samples.filter(sample => sample.category === categoryKey);
            if (categorySamples.length === 0) return null;
            
            return (
              <section key={categoryKey} className={styles.category}>
                <h3>{categoryName}</h3>
                <div className={styles.grid}>
                  {categorySamples.map((sample) => (
                    <Link 
                      key={sample.id} 
                      href={sample.path}
                      className={styles.card}
                    >
                      <div className={styles.thumbnail}>
                        <Image
                          src={sample.thumbnail}
                          alt={sample.title}
                          width={200}
                          height={150}
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+Cjwvc3ZnPg=="
                        />
                      </div>
                      <div className={styles.cardContent}>
                        <h4>{sample.title}</h4>
                        <p>{sample.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      
      <footer className={styles.footer}>
        <p>Built with @t2421/motion package</p>
      </footer>
    </div>
  );
}
