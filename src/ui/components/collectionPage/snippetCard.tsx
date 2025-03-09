import { useNavigate } from "react-router-dom"

export const SnippetCard = () => {
    const navigateTo = useNavigate()
    return(
        <div onClick={() => navigateTo('/snippet/1')} className="bg-dark-secondary rounded-lg p-6 cursor-pointer">
        <div className='mb-4'>
          <h3 className="text-light-gray font-semibold text-xl mb-1">Plataforma 2D</h3>
          <p className='text-xs text-neutral-gray'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <img className='aspect-square max-w-6 rounded-full' src='https://github.com/gibranKhalil.png' alt='Gibran Khalil' />
            <hgroup>
              <h3 className="text-light-gray text-xs">Gibran Khalil</h3>
              <h3 className="text-neutral-gray text-[10px]">12/02/2025</h3>
            </hgroup>
          </div>
          <p className='text-neutral-gray text-xs'>AthenaENV</p>
        </div>
      </div>
    )
}