const $document = $(document);

// 일 데이터
const workResultData = {
    // key: day

    // 'data': '22.01.01'
    // 'endTime': '18.5'
    // 1 : {
    //     'date': '',
    //     'endTime': '',
    // }
}

// 템플릿에 데이터 넣기
const addHtmlByTemplate = (wrapperClass, templateClass, data) => {
    const $wrapper = $(wrapperClass);
    const $template = $(templateClass);

    let templateString = $template.text();
    $.each(data, (key, value) => {
        templateString = templateString.replaceAll(`{[${key}]}`, value);
    })
    
    $wrapper.append(templateString);
}

// 데이터 추가 버튼처리
const addData = () => {
    // 18.5 => 18:30
    const numberToTime = (numberTime) => {

        // 소수점 아니면
        if (Math.ceil(numberTime) == numberTime) {
            return numberTime.toString() + ':00';
        }
        else {
            return Math.floor(numberTime).toString() + ':30';
        }
    
    }

    // 날짜 정보 생성(쪼개기)
    const splitDate = (date) => {
        const resultDate = {
            'original': '',
            'year' : '',
            'month' : '',
            'day' : '',
            'total': '',
        }
    
        const YMD = date.split('-');
    
        resultDate['original'] = date;
        resultDate['year'] = YMD[0].slice(-2);
        resultDate['month'] = YMD[1];
        resultDate['day'] = YMD[2];
        resultDate['total'] = [resultDate['year'], resultDate['month'], resultDate['day']].join('.');
    
        return resultDate;
    }

    // WORK 데이터 템플릿 사용해서 HTML에 입력
    const addWorkDataToHtml = (workData) => {
        // 기존 일 정보 삭제
        $('.js__work-table__row').remove();

        // 순서
        let number = 0;
        $.each(workData, (day, data) => {
            number += 1;

            const templateData = {
                'workNumber': number,
                'workDate': data['date'],
                'workEndTime': numberToTime(data['endTime']),
            }

            addHtmlByTemplate('.js__work-table', '.js__template__work', templateData);
        });
    }

    // 일 추가
    $document.on('click', '.js__add-work', event => {
        if(!event.target) return;

        // 일 정보 form
        const $workForm = $('.js__work-form');

        const date = $workForm.find("input[name='work-date']").val();
        const time = Number($workForm.find("select[name='work-time']").val());

        // TODO: validation 따로 구분 필요
        if (!date) {
            alert('날짜를 선택해주세요.')
            return;
        }

        const totalDate = splitDate(date);

        // 새로 입력된 데이터
        const newResultData = {
            'date': totalDate['total'],
            'endTime': time
        }

        // 저장
        const day = Number(totalDate['day']);
        workResultData[day] = newResultData;

        // 템플릿 이용해 HTML에 데이터 추가
        addWorkDataToHtml(workResultData);
        
        // show
    });

}

const overTimeInit = () => {
    addData();

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        };
        }, true);
}

overTimeInit();