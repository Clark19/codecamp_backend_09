const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

export const getMockUsersData = (numOfUser) => {
  if (!numOfUser || numOfUser < 1 || isNaN(numOfData)) return
  if (numOfUser >= 10000) {
    console.log("현재 가짜 전화번호 생성 구현상 네자리 수인 1~9999명까지만 인자를 입력 받습니다. 9999명으로 세팅")
    numOfUser = 9999
  }

  const users = []
  let juminNumFront = ""
  for (let i = 1; i <= numOfUser; i++) {
    juminNumFront = randomIntFromInterval(40,99) + String(randomIntFromInterval(1,12)).padStart(2,"0")
       + String(randomIntFromInterval(1,28)).padStart(2,"0") + "-0000000"
    users.push({
      email: `user${i}@email.com`,
      name: "이름"+i, 
      phone: "010-1111-"+String(i).padStart(4, "0"), 
      personal: juminNumFront, 
      prefer: `https://www.google${i}.com`
    })
  }

  return users
}

export const getMockCoffeeData = (numOfData) => {
    if (!numOfData || numOfData < 1 || isNaN(numOfData)) return
    if (numOfData >= 20000) { // 
      console.log("현재 데이터 최대값 제한을 19999개로 세팅하여 해당 개수를 초과 할 수 없음.``-")
      numOfData = 19999
    }
  
    const coffees = []
    for (let i = 1; i <= numOfData; i++) {
        coffees.push({name: "커피종류"+i, kcal: randomIntFromInterval(1, 1000)})        
    }

    return coffees
}

export function getToday() {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = date.getMonth() + 1
  const dd = date.getDate()
  const result = `${yyyy}-${mm}-${dd}`

  return result
}