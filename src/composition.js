import { ref } from 'vue';

const wikis = await fetch('https://wikistats.wmcloud.org/wikimedias_csv.php')
  .then(res => res.text())
  .then(res =>
    // Ref makes entire array reactive
    ref(
      res.split('\n')
        .map(row => row.split(','))
        .filter(row => row[2] !== 'special')
        .map(row => (
          {
            title: `${row[4]} ${row[2]}`,
            link: `${row[1]}.${row[2]}.org`,
            checked: false
          }
        )
        )
        .slice(1, -1)
    )
  );

export const useWikis = () => wikis;