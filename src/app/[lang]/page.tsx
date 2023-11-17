import { use } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import { useTranslation } from '@/app/i18n';
import Link from 'next/link';

/** The home page */
export default function HomePage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, ['home', 'app', 'common']));

  return (
    <main className='prose max-w-none min-h-screen pb-12'>
      {/* Hero section */}
      <section
        className={'text-accent-content bg-gradient-to-r from-accent'
          + ' to-[color-mix(in_oklab,oklch(var(--a)),oklch(var(--bc)))] '
          + ' py-10 sm:py-12 md:py-20 px-8 font-display'
        }
      >
        <div className='max-w-5xl mx-auto text-center'>
          <p className='text-4xl font-bold my-0'>{t('home:hero.main_paragraph')}</p>
          <Link data-testid='startBtn' href={`${lang}/txn`}
            className={'btn btn-lg btn-block h-auto mt-10 md:mt-14 leading-6 shadow-2xl border-none'
              + ' btn-primary hover:btn-secondary'
            }
          >
            {t('home:hero.start_button')}
          </Link>
        </div>
      </section>

      {/* Additional information section */}
      <section className='max-w-6xl mx-auto px-6'>
        {/* How It Works */}
        <h2 id='how-it-works'>{t('home:how_it_works.heading')}</h2>
        <div className='grid md:grid-cols-3 gap-2 lg:gap-4'>
          <div className='card bg-base-200 prose-headings:text-accent'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>
                {t('home:how_it_works.compose.heading')}
              </h3>
              <p className='self-start md:mb-4'>{t('home:how_it_works.compose.paragraph')}</p>
              <Link data-testid='composeTxnBtn'
                className='btn btn-accent btn-sm h-auto p-2'
                href={`${lang}/txn/compose`}
              >
                {t('home:how_it_works.compose.button')}
              </Link>
            </div>
          </div>
          <div className='card bg-base-200 prose-headings:text-accent'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>
                {t('home:how_it_works.sign.heading')}
              </h3>
              <p className='self-start md:mb-4'>{t('home:how_it_works.sign.paragraph')}</p>
              <Link data-testid='signTxnBtn'
                className='btn btn-accent btn-sm h-auto p-2 btn-disabled'
                href={`${lang}/txn/sign`}
                aria-disabled
                tabIndex={-1}
              >
                {t('home:how_it_works.sign.button')}
              </Link>
            </div>
          </div>
          <div className='card bg-base-200 prose-headings:text-accent'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>
                {t('home:how_it_works.send.heading')}
              </h3>
              <p className='self-start md:mb-4'>{t('home:how_it_works.send.paragraph')}</p>
              <Link data-testid='sendTxnBtn'
                className='btn btn-accent btn-sm h-auto p-2 btn-disabled'
                href={`${lang}/txn/send`}
                aria-disabled
                tabIndex={-1}
              >
                {t('home:how_it_works.send.button')}
              </Link>
            </div>
          </div>
        </div>

        {/* Uses */}
        <h2 id='uses'>{t('home:uses.heading')}</h2>
        <div className='grid md:grid-cols-3 gap-2 lg:gap-4'>
          <div className='card border-2 border-success bg-opacity-80'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>
                {t('home:uses.simple_things.heading')}
              </h3>
              <ul className='self-start marker:text-success'>
                <li>{t('home:uses.simple_things.list.0')}</li>
                <li>
                  <Trans t={t} i18nKey='home:uses.simple_things.list.1'>
                    opt_in_to_<abbr title={t('algo_std_asset')}>asa</abbr>
                  </Trans>
                </li>
                <li>
                  <Trans t={t} i18nKey='home:uses.simple_things.list.2'>
                    transfer_<abbr title={t('nonfungible_token')}>nft</abbr>
                  </Trans>
                </li>
                <li>{t('home:uses.simple_things.list.3')}</li>
              </ul>
            </div>
          </div>
          <div className='card border-2 border-warning bg-opacity-80'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>
                {t('home:uses.complex_things.heading')}
              </h3>
              <ul className='self-start marker:text-warning'>
                <li>{t('home:uses.complex_things.list.0')}</li>
                <li>{t('home:uses.complex_things.list.1')}</li>
                <li>{t('home:uses.complex_things.list.2')}</li>
                <li>{t('home:uses.complex_things.list.3')}</li>
              </ul>
            </div>
          </div>
          <div className='card border-2 border-error bg-opacity-80'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>
                {t('home:uses.dangerous_things.heading')}
              </h3>
              <ul className='self-start marker:text-error'>
                <li>{t('home:uses.dangerous_things.list.0')}</li>
                <li>{t('home:uses.dangerous_things.list.1')}</li>
                <li>{t('home:uses.dangerous_things.list.2')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
